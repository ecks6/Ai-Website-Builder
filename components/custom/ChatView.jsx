"use client"
import { MessagesContext } from '@/context/MessagesContext';
import { ArrowRight, Send, Loader2Icon, User, Bot, Sparkles } from 'lucide-react';
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
    }

    const onGenerate = (input) => {
        setMessages(prev => [...prev, {
            role: 'user',
            content: input
        }]);
        setUserInput('');
    }

    return (
        <div className="relative h-[85vh] flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
            {/* macOS Terminal Header */}
            <div className="bg-slate-800 px-4 py-3 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                    {/* macOS Window Controls */}
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors cursor-pointer"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors cursor-pointer"></div>
                    </div>
                    
                    {/* Terminal Title */}
                    <div className="flex items-center space-x-3">
                        <span className="text-slate-300 text-sm font-mono">AI_CHAT_TERMINAL</span>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-turquoise-400 rounded-full"></div>
                            <span className="text-xs text-slate-400">{messages?.length || 0}</span>
                        </div>
                    </div>
                    
                    {/* Status Indicator */}
                    <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>ONLINE</span>
                    </div>
                </div>
            </div>

            {/* Terminal Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-900 p-4 font-mono text-sm">
                <div className="space-y-4">
                    {/* Terminal Welcome */}
                    <div className="text-slate-500 text-xs">
                        <span className="text-turquoise-400">$</span> AI Assistant initialized...
                    </div>
                    
                    {Array.isArray(messages) && messages?.map((msg, index) => (
                        <div key={index} className="space-y-2">
                            {msg.role === 'user' ? (
                                // User Message
                                <div className="flex items-start space-x-3">
                                    <div className="flex items-center space-x-2 min-w-0">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <User className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-blue-400 font-medium text-sm">You</span>
                                    </div>
                                    <div className="flex-1 bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
                                        <ReactMarkdown className="text-slate-200 text-sm leading-relaxed">
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ) : (
                                // AI Message
                                <div className="flex items-start space-x-3">
                                    <div className="flex items-center space-x-2 min-w-0">
                                        <div className="w-8 h-8 bg-gradient-to-r from-turquoise-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Bot className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-turquoise-400 font-medium text-sm">AI Assistant</span>
                                    </div>
                                    <div className="flex-1 bg-turquoise-500/10 rounded-lg p-3 border border-turquoise-500/20">
                                        <ReactMarkdown className="text-slate-200 text-sm leading-relaxed">
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {loading && (
                        <div className="flex items-start space-x-3">
                            <div className="flex items-center space-x-2 min-w-0">
                                <div className="w-8 h-8 bg-gradient-to-r from-turquoise-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Bot className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-turquoise-400 font-medium text-sm">AI Assistant</span>
                            </div>
                            <div className="flex-1 bg-turquoise-500/10 rounded-lg p-3 border border-turquoise-500/20">
                                <div className="flex items-center space-x-3 text-turquoise-400">
                                    <Loader2Icon className="animate-spin h-4 w-4" />
                                    <div className="flex space-x-1">
                                        <div className="w-1.5 h-1.5 bg-turquoise-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-turquoise-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-1.5 h-1.5 bg-turquoise-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                    <span className="text-sm">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Terminal Input Area */}
            <div className="bg-slate-800 border-t border-slate-700/50 p-4">
                <div className="flex items-center space-x-3">
                    {/* Terminal Prompt */}
                    <div className="flex items-center space-x-2 text-slate-400 font-mono text-sm">
                        <span className="text-turquoise-400">$</span>
                        <span>chat</span>
                        <span className="text-slate-600">></span>
                    </div>
                    
                    {/* Input Field */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Type your message... (Press Enter to send)"
                            value={userInput || ''}
                            onChange={(event) => setUserInput(event.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-turquoise-500/50 focus:border-turquoise-500/50 outline-none transition-all duration-200 font-mono text-sm"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && userInput?.trim()) {
                                    onGenerate(userInput);
                                }
                            }}
                        />
                        {userInput && (
                            <button
                                onClick={() => onGenerate(userInput)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-turquoise-500 hover:bg-turquoise-600 rounded-md p-1.5 transition-colors duration-200"
                            >
                                <Send className="h-4 w-4 text-white" />
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Terminal Footer */}
                <div className="flex items-center justify-between mt-3 text-xs text-slate-500 font-mono">
                    <div className="flex items-center space-x-4">
                        <span>Press Enter to send, Shift+Enter for new line</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span>Powered by</span>
                        <span className="text-turquoise-400">AI</span>
                        <div className="flex items-center space-x-1">
                            <span>React</span>
                            <span className="text-slate-600">Mode</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatView;