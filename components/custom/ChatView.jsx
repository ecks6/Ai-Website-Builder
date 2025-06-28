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
        <div className="h-full flex flex-col glass-dark border border-turquoise-500/20 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-turquoise-500/10 to-cyan-500/10 p-3 md:p-4 border-b border-turquoise-500/20 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="w-3 h-3 bg-turquoise-400 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 bg-turquoise-400 rounded-full blur-sm opacity-50"></div>
                    </div>
                    <h2 className="text-turquoise-300 font-semibold text-sm md:text-base">AI Assistant</h2>
                    <div className="flex-1"></div>
                    <div className="text-xs text-slate-400 bg-slate-800/50 px-2 md:px-3 py-1 rounded-full">
                        {messages?.length || 0} messages
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-3 md:p-4 lg:p-6 min-h-0">
                <div className="space-y-4 md:space-y-6">
                    {Array.isArray(messages) && messages?.map((msg, index) => (
                        <div
                            key={index}
                            className={`group flex gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* Avatar */}
                            <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center ${
                                msg.role === 'user' 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                                    : 'bg-gradient-to-r from-turquoise-500 to-cyan-500'
                            } shadow-lg`}>
                                {msg.role === 'user' ? (
                                    <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                ) : (
                                    <Bot className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                )}
                            </div>

                            {/* Message Content */}
                            <div className={`flex-1 max-w-[80%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                <div className={`inline-block p-3 md:p-4 rounded-2xl glass-dark border transition-all duration-300 group-hover:border-turquoise-500/40 ${
                                    msg.role === 'user' 
                                        ? 'border-blue-500/30 bg-blue-500/5' 
                                        : 'border-turquoise-500/30 bg-turquoise-500/5'
                                }`}>
                                    <ReactMarkdown className="prose prose-invert prose-sm max-w-none text-xs md:text-sm">
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                                <div className="text-xs text-slate-500 mt-1 md:mt-2 px-2">
                                    {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {loading && (
                        <div className="flex gap-3 md:gap-4">
                            <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-r from-turquoise-500 to-cyan-500 flex items-center justify-center shadow-lg">
                                <Bot className="h-4 w-4 md:h-5 md:w-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="inline-block p-3 md:p-4 rounded-2xl glass-dark border border-turquoise-500/30 bg-turquoise-500/5">
                                    <div className="flex items-center gap-3 text-turquoise-400">
                                        <Loader2Icon className="animate-spin h-4 w-4 md:h-5 md:w-5" />
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-turquoise-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-turquoise-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                            <div className="w-2 h-2 bg-turquoise-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        </div>
                                        <span className="font-medium text-xs md:text-sm">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Section */}
            <div className="border-t border-turquoise-500/20 bg-slate-900/50 backdrop-blur-sm p-3 md:p-4 lg:p-6 flex-shrink-0">
                <div className="relative">
                    <div className="flex gap-3 md:gap-4">
                        <div className="flex-1 relative group">
                            <textarea
                                placeholder="Ask me anything about your project..."
                                value={userInput}
                                onChange={(event) => setUserInput(event.target.value)}
                                className="w-full bg-slate-800/50 border-2 border-turquoise-500/20 rounded-xl p-3 md:p-4 pr-12 text-slate-100 placeholder-turquoise-300/50 focus:ring-0 focus:border-turquoise-500 outline-none transition-all duration-300 resize-none h-16 md:h-20 hover:border-turquoise-500/40 text-sm md:text-base"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (userInput?.trim()) {
                                            onGenerate(userInput);
                                        }
                                    }
                                }}
                            />
                            {userInput && (
                                <button
                                    onClick={() => onGenerate(userInput)}
                                    className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-turquoise-500 to-cyan-500 hover:from-turquoise-600 hover:to-cyan-600 rounded-lg p-2 transition-all duration-200 hover-lift neon-turquoise"
                                >
                                    <Send className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex items-center justify-between mt-3 md:mt-4">
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                            <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line</span>
                            <span className="sm:hidden">Enter to send</span>
                        </div>
                        <div className="text-xs text-slate-500">
                            Powered by AI
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatView;