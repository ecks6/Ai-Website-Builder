"use client"
import Lookup from '@/data/Lookup';
import { MessagesContext } from '@/context/MessagesContext';
import { ArrowRight, Send, Wand2, Loader2, Sparkles } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

function Hero() {
    const [userInput, setUserInput] = useState('');
    const [isEnhancing, setIsEnhancing] = useState(false);
    const { messages, setMessages } = useContext(MessagesContext);
    const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
    const router = useRouter();

    const onGenerate = async (input) => {
        const msg = {
            role: 'user',
            content: input
        }
        setMessages(msg);
        const workspaceID = await CreateWorkspace({
            messages: [msg]
        });
        router.push('/workspace/' + workspaceID);
    }

    const enhancePrompt = async () => {
        if (!userInput) return;
        
        setIsEnhancing(true);
        try {
            const response = await fetch('/api/enhance-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userInput }),
            });

            const data = await response.json();
            if (data.enhancedPrompt) {
                setUserInput(data.enhancedPrompt);
            }
        } catch (error) {
            console.error('Error enhancing prompt:', error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const onSuggestionClick = (suggestion) => {
        setUserInput(suggestion);
    };

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            {/* Subtle background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#14b8a6_1px,transparent_1px),linear-gradient(to_bottom,#14b8a6_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.02]"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-turquoise-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 py-20 relative z-10">
                <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12">
                    
                    {/* Minimalist Header */}
                    <div className="text-center space-y-6 max-w-4xl">
                        <div className="inline-flex items-center space-x-2 bg-turquoise-500/10 rounded-full px-4 py-2 border border-turquoise-500/20">
                            <Sparkles className="h-4 w-4 text-turquoise-400" />
                            <span className="text-turquoise-400 text-sm font-medium">AI Website Builder</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                            <span className="block text-white mb-2">Build websites with</span>
                            <span className="block bg-gradient-to-r from-turquoise-400 to-cyan-400 bg-clip-text text-transparent">
                                AI assistance
                            </span>
                        </h1>
                        
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Describe your idea and watch it transform into production-ready code
                        </p>
                    </div>

                    {/* Clean Input Section */}
                    <div className="w-full max-w-3xl">
                        <div className="relative">
                            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-turquoise-500/20 p-6">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <textarea
                                            placeholder="Describe your website idea..."
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-turquoise-500/20 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:border-turquoise-500 focus:ring-0 outline-none resize-none h-32 transition-all duration-300"
                                            disabled={isEnhancing}
                                        />
                                    </div>
                                    
                                    {userInput && (
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={enhancePrompt}
                                                disabled={isEnhancing}
                                                className="flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-xl p-3 transition-all duration-200 disabled:opacity-50"
                                                title="Enhance prompt"
                                            >
                                                {isEnhancing ? (
                                                    <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
                                                ) : (
                                                    <Wand2 className="h-5 w-5 text-slate-300" />
                                                )}
                                            </button>
                                            
                                            <button
                                                onClick={() => onGenerate(userInput)}
                                                disabled={isEnhancing}
                                                className="flex items-center justify-center bg-turquoise-500 hover:bg-turquoise-600 rounded-xl p-3 transition-all duration-200 disabled:opacity-50"
                                                title="Generate website"
                                            >
                                                <Send className="h-5 w-5 text-white" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {userInput && (
                                    <div className="mt-4 text-xs text-slate-500 text-center">
                                        Press the magic wand to enhance your prompt, then send to generate
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Simple Suggestions */}
                    <div className="w-full max-w-5xl">
                        <div className="text-center mb-6">
                            <p className="text-slate-400 text-sm">Or try one of these examples:</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {Lookup?.SUGGSTIONS.slice(0, 6).map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => onSuggestionClick(suggestion)}
                                    className="group p-4 bg-slate-900/30 hover:bg-slate-800/50 border border-turquoise-500/10 hover:border-turquoise-500/30 rounded-xl text-left transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-300 text-sm">{suggestion}</span>
                                        <ArrowRight className="h-4 w-4 text-turquoise-400/60 group-hover:text-turquoise-400 group-hover:translate-x-1 transition-all duration-200" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;