"use client"
import { MessagesContext } from '@/context/MessagesContext';
import { ArrowRight, Send, Loader2Icon, User, Bot, Sparkles, Terminal, Zap, Code, MessageSquare } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'convex/react';
import Prompt from '@/data/Prompt';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function ChatView() {
    const { id } = useParams();
    const convex = useConvex();
    const { messages, setMessages } = useContext(MessagesContext);
    const [userInput, setUserInput] = useState();
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const UpdateMessages = useMutation(api.workspace.UpdateWorkspace);

    useEffect(() => {
        id && GetWorkSpaceData();
    }, [id])

    const GetWorkSpaceData = async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        });
        setMessages(result?.messages);
    }

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role === 'user') {
                GetAiResponse();
            }
        }
    }, [messages])

    const GetAiResponse = async () => {
        setLoading(true);
        setIsTyping(true);
        const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
        const result = await axios.post('/api/ai-chat', {
            prompt: PROMPT
        });

        const aiResp = {
            role: 'ai',
            content: result.data.result
        }
        setMessages(prev => [...prev, aiResp]);
        await UpdateMessages({
            messages: [...messages, aiResp],
            workspaceId: id
        })
        setLoading(false);
        setIsTyping(false);
    }

    const onGenerate = (input) => {
        setMessages(prev => [...prev, {
            role: 'user',
            content: input
        }]);
        setUserInput('');
    }

    return (
        <div className="relative h-[85vh] flex flex-col glass-terminal rounded-2xl overflow-hidden terminal-glow">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-turquoise-500/10 via-cyan-500/10 to-blue-500/10 p-4 border-b border-turquoise-500/30">
                <div className="flex items-center space-x-3">
                    {/* Terminal dots */}
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                    
                    {/* Terminal title */}
                    <div className="flex items-center space-x-2">
                        <Terminal className="h-4 w-4 text-turquoise-400" />
                        <span className="text-turquoise-300 font-mono text-sm font-semibold">AI_CHAT_TERMINAL</span>
                    </div>
                    
                    <div className="flex-1"></div>
                    
                    {/* Status indicators */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-full border border-turquoise-500/20">
                            <MessageSquare className="h-3 w-3 text-turquoise-400" />
                            <span className="text-xs text-slate-300">{messages?.length || 0}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-emerald-400 font-medium">ONLINE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages with enhanced styling */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-6 matrix-bg">
                <div className="space-y-6">
                    {Array.isArray(messages) && messages?.map((msg, index) => (
                        <div
                            key={index}
                            className={`group flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* Enhanced Avatar */}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center relative ${
                                msg.role === 'user' 
                                    ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                                    : 'bg-gradient-to-br from-turquoise-500 to-cyan-500'
                            } shadow-lg hover-glow`}>
                                {msg.role === 'user' ? (
                                    <User className="h-6 w-6 text-white" />
                                ) : (
                                    <Bot className="h-6 w-6 text-white" />
                                )}
                                
                                {/* Pulse ring */}
                                <div className={`absolute inset-0 rounded-xl ${
                                    msg.role === 'user' 
                                        ? 'bg-blue-500' 
                                        : 'bg-turquoise-500'
                                } opacity-20 animate-ping`}></div>
                            </div>

                            {/* Enhanced Message Content */}
                            <div className={`flex-1 max-w-[80%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                <div className={`inline-block p-5 rounded-2xl glass-dark border transition-all duration-300 group-hover:border-turquoise-500/50 hover-lift ${
                                    msg.role === 'user' 
                                        ? 'border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-purple-500/5' 
                                        : 'border-turquoise-500/30 bg-gradient-to-br from-turquoise-500/10 to-cyan-500/5'
                                }`}>
                                    <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                                
                                {/* Enhanced timestamp */}
                                <div className={`text-xs text-slate-500 mt-2 px-2 flex items-center gap-2 ${
                                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${
                                        msg.role === 'user' ? 'bg-blue-400' : 'bg-turquoise-400'
                                    } animate-pulse`}></div>
                                    <span>{msg.role === 'user' ? 'You' : 'AI Assistant'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Enhanced loading state */}
                    {loading && (
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-turquoise-500 to-cyan-500 flex items-center justify-center shadow-lg animate-pulse-glow">
                                <Bot className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="inline-block p-5 rounded-2xl glass-dark border border-turquoise-500/30 bg-gradient-to-br from-turquoise-500/10 to-cyan-500/5">
                                    <div className="flex items-center gap-4 text-turquoise-400">
                                        <Loader2Icon className="animate-spin h-5 w-5" />
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-turquoise-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-turquoise-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                            <div className="w-2 h-2 bg-turquoise-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        </div>
                                        <span className="font-medium neon-text">AI is thinking...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Enhanced Input Section */}
            <div className="border-t border-turquoise-500/30 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm p-6">
                <div className="relative">
                    <div className="flex gap-4">
                        <div className="flex-1 relative group">
                            <textarea
                                placeholder="Type your message... (Press Enter to send)"
                                value={userInput}
                                onChange={(event) => setUserInput(event.target.value)}
                                className="w-full bg-slate-800/50 border-2 border-turquoise-500/20 rounded-xl p-4 pr-16 text-slate-100 placeholder-turquoise-300/50 focus:ring-0 focus:border-turquoise-500 outline-none transition-all duration-300 resize-none h-20 hover:border-turquoise-500/40 hover-glow font-mono"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (userInput?.trim()) {
                                            onGenerate(userInput);
                                        }
                                    }
                                }}
                            />
                            
                            {/* Send button */}
                            {userInput && (
                                <button
                                    onClick={() => onGenerate(userInput)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-turquoise-500 to-cyan-500 hover:from-turquoise-600 hover:to-cyan-600 rounded-lg p-3 transition-all duration-200 hover-lift neon-turquoise group"
                                >
                                    <Send className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                                </button>
                            )}
                            
                            {/* Typing indicator */}
                            {isTyping && (
                                <div className="absolute bottom-2 left-4 text-xs text-turquoise-400 flex items-center gap-2">
                                    <div className="flex space-x-1">
                                        <div className="w-1 h-1 bg-turquoise-400 rounded-full animate-bounce"></div>
                                        <div className="w-1 h-1 bg-turquoise-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-1 h-1 bg-turquoise-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                    <span>AI is typing...</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Enhanced Quick Actions */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3 text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-turquoise-400" />
                                <span>Press Enter to send, Shift+Enter for new line</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Zap className="h-3 w-3 text-yellow-400" />
                                <span>Powered by AI</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Code className="h-3 w-3 text-turquoise-400" />
                                <span>React Mode</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatView;