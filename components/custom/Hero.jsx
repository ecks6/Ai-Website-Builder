"use client"
import Lookup from '@/data/Lookup';
import { MessagesContext } from '@/context/MessagesContext';
import { ArrowRight, Send, Wand2, Loader2, Zap, Code2, Palette, Sparkles } from 'lucide-react';
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

    // Template icons mapping
    const templateIcons = {
        'Create Todo App': Code2,
        'Create a Budget Track App': Zap,
        'Create a Login and Signup page': Palette,
        'Develop a Task Management App': Code2,
        'Create a Fully Responsive Blog Platform': Palette,
        'Design a Minimalistic Note-Taking App': Zap
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

            <div className="container mx-auto px-6 py-12 relative z-10">
                <div className="flex flex-col items-center justify-center space-y-8">
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
                                    <div className="relative">
                                        <textarea
                                            placeholder="Describe your vision... (e.g., 'Create a modern e-commerce dashboard with dark theme')"
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            className="w-full bg-transparent border-2 border-turquoise-500/20 rounded-xl p-6 pr-32 text-slate-100 placeholder-turquoise-300/50 focus:border-turquoise-500 focus:ring-0 outline-none font-mono text-lg h-32 resize-none transition-all duration-300 hover:border-turquoise-500/40"
                                            disabled={isEnhancing}
                                        />
                                        
                                        {/* Integrated Action Buttons */}
                                        {userInput && (
                                            <div className="absolute right-3 top-3 flex flex-col gap-2">
                                                {/* Enhance Button */}
                                                <button
                                                    onClick={enhancePrompt}
                                                    disabled={isEnhancing}
                                                    className={`group relative w-12 h-12 bg-slate-800/80 hover:bg-slate-700/80 border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl transition-all duration-300 hover:scale-105 ${isEnhancing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                    title="Enhance prompt with AI"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative flex items-center justify-center h-full">
                                                        {isEnhancing ? (
                                                            <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                                                        ) : (
                                                            <Wand2 className="h-5 w-5 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" />
                                                        )}
                                                    </div>
                                                    {/* Tooltip */}
                                                    <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-slate-800 text-emerald-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                                                        Enhance
                                                    </div>
                                                </button>
                                                
                                                {/* Generate Button */}
                                                <button
                                                    onClick={() => onGenerate(userInput)}
                                                    disabled={isEnhancing}
                                                    className={`group relative w-12 h-12 bg-gradient-to-r from-turquoise-500/20 to-cyan-500/20 hover:from-turquoise-500/30 hover:to-cyan-500/30 border border-turquoise-500/40 hover:border-turquoise-500/60 rounded-xl transition-all duration-300 hover:scale-105 ${isEnhancing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                    title="Generate project"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-turquoise-400/0 to-cyan-400/0 group-hover:from-turquoise-400/10 group-hover:to-cyan-400/10 rounded-xl transition-all duration-300"></div>
                                                    <div className="relative flex items-center justify-center h-full">
                                                        <Send className="h-5 w-5 text-turquoise-400 group-hover:text-turquoise-300 transition-colors duration-300" />
                                                    </div>
                                                    {/* Tooltip */}
                                                    <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-slate-800 text-turquoise-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                                                        Generate
                                                    </div>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Bottom Actions */}
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                                            <Sparkles className="h-4 w-4 text-turquoise-400/60" />
                                            <span>Press Ctrl+Enter to enhance, Enter to generate</span>
                                        </div>
                                        {userInput && (
                                            <div className="text-xs text-slate-500">
                                                {userInput.length} characters
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compact Templates Section - No Headers */}
                    <div className="w-full max-w-5xl">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {Lookup?.SUGGSTIONS.map((suggestion, index) => {
                                const IconComponent = templateIcons[suggestion] || Code2;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => onSuggestionClick(suggestion)}
                                        className="group relative p-3 bg-slate-900/30 hover:bg-slate-800/40 border border-slate-700/20 hover:border-turquoise-500/30 rounded-lg text-left transition-all duration-300 hover-lift overflow-hidden"
                                    >
                                        {/* Animated background gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-turquoise-500/0 via-turquoise-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        
                                        {/* Content */}
                                        <div className="relative z-10 flex items-center space-x-3">
                                            {/* Icon */}
                                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-turquoise-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center group-hover:from-turquoise-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
                                                <IconComponent className="h-4 w-4 text-turquoise-400 group-hover:text-turquoise-300 transition-colors duration-300" />
                                            </div>
                                            
                                            {/* Text */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-slate-200 group-hover:text-slate-100 font-medium text-xs transition-colors duration-300 leading-tight">
                                                    {suggestion}
                                                </h4>
                                            </div>
                                            
                                            {/* Arrow */}
                                            <div className="flex-shrink-0">
                                                <ArrowRight className="h-3 w-3 text-slate-500 group-hover:text-turquoise-400 group-hover:translate-x-0.5 transition-all duration-300" />
                                            </div>
                                        </div>
                                        
                                        {/* Animated border */}
                                        <div className="absolute inset-0 rounded-lg border border-turquoise-500/0 group-hover:border-turquoise-500/20 transition-all duration-300"></div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;