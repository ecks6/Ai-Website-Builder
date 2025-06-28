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
            {/* Animated background */}
            <div className="absolute inset-0">
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#14b8a6_1px,transparent_1px),linear-gradient(to_bottom,#14b8a6_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03]"></div>
                
                {/* Gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-turquoise-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-turquoise-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-turquoise-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 py-20 relative z-10">
                <div className="flex flex-col items-center justify-center space-y-16">
                    {/* Enhanced Input Section */}
                    <div className="w-full max-w-4xl">
                        <div className="relative group">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-turquoise-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
                            
                            <div className="relative glass-dark rounded-2xl border-2 border-turquoise-500/30 hover:border-turquoise-500/50 transition-all duration-300 overflow-hidden">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-turquoise-500/10 to-cyan-500/10 p-4 border-b border-turquoise-500/20">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                        </div>
                                        <span className="text-turquoise-300 text-sm font-mono">AI_PROMPT_TERMINAL</span>
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="p-6">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <textarea
                                                placeholder="Describe your vision... (e.g., 'Create a modern e-commerce dashboard with dark theme')"
                                                value={userInput}
                                                onChange={(e) => setUserInput(e.target.value)}
                                                className="w-full bg-transparent border-2 border-turquoise-500/20 rounded-xl p-6 text-slate-100 placeholder-turquoise-300/50 focus:border-turquoise-500 focus:ring-0 outline-none font-mono text-lg h-40 resize-none transition-all duration-300 hover:border-turquoise-500/40"
                                                disabled={isEnhancing}
                                            />
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-3">
                                            {userInput && (
                                                <>
                                                    {/* Enhance Button */}
                                                    <button
                                                        onClick={enhancePrompt}
                                                        disabled={isEnhancing}
                                                        className={`group relative flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl px-6 py-4 transition-all duration-300 hover-lift ${isEnhancing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                                                        {isEnhancing ? (
                                                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                                                        ) : (
                                                            <Wand2 className="h-6 w-6 text-white" />
                                                        )}
                                                    </button>
                                                    
                                                    {/* Generate Button */}
                                                    <button
                                                        onClick={() => onGenerate(userInput)}
                                                        disabled={isEnhancing}
                                                        className={`group relative flex items-center justify-center bg-gradient-to-r from-turquoise-500 to-cyan-500 hover:from-turquoise-600 hover:to-cyan-600 rounded-xl px-6 py-4 transition-all duration-300 hover-lift neon-turquoise ${isEnhancing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-turquoise-400 to-cyan-400 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                                                        <Send className="h-6 w-6 text-white" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Optimized Templates Section */}
                    <div className="w-full max-w-5xl">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center space-x-2 bg-turquoise-500/10 rounded-full px-6 py-3 mb-4 border border-turquoise-500/30">
                                <Sparkles className="h-5 w-5 text-turquoise-400" />
                                <span className="text-turquoise-400 font-semibold">Quick Start</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-3">Choose a Template</h3>
                            <p className="text-slate-400 text-lg">Start with a pre-built template and customize it to your needs</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Lookup?.SUGGSTIONS.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => onSuggestionClick(suggestion)}
                                    className="group relative p-8 glass-dark hover:bg-slate-800/60 border-2 border-turquoise-500/20 rounded-2xl text-left transition-all duration-300 hover:border-turquoise-500/50 hover-lift"
                                >
                                    {/* Hover glow */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-turquoise-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                                    
                                    {/* Content */}
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-3 h-3 bg-turquoise-400 rounded-full animate-pulse"></div>
                                            <ArrowRight className="h-5 w-5 text-turquoise-400/60 group-hover:text-turquoise-400 group-hover:translate-x-1 transition-all duration-300" />
                                        </div>
                                        <h4 className="text-white group-hover:text-turquoise-300 font-semibold text-lg mb-2 transition-colors duration-300">
                                            {suggestion}
                                        </h4>
                                        <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">
                                            Click to start building
                                        </p>
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