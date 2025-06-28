import React from 'react';
import { Code, Sparkles, Zap, Terminal, Cpu } from 'lucide-react';

function Header() {
    return (
        <header className="border-b border-turquoise-500/20 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-50 glass-dark">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Enhanced Logo and Title */}
                    <div className="flex items-center space-x-4 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-turquoise-400 to-cyan-400 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse-glow"></div>
                            <div className="relative bg-gradient-to-r from-turquoise-500 to-cyan-500 p-3 rounded-xl hover-lift">
                                <Code className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-turquoise-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                                AI Website Builder
                            </h1>
                            <p className="text-xs text-turquoise-300/70 font-medium tracking-wide">
                                Next-Gen Development Platform
                            </p>
                        </div>
                    </div>

                    {/* Enhanced Status Section */}
                    <div className="flex items-center space-x-4">
                        {/* AI Status */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-turquoise-400 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                            <div className="relative flex items-center space-x-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-6 py-3 rounded-full text-sm font-semibold border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer hover-lift">
                                <div className="relative">
                                    <Cpu className="h-5 w-5 animate-pulse" />
                                    <div className="absolute inset-0 bg-emerald-400 rounded-full blur-sm opacity-50 animate-pulse"></div>
                                </div>
                                <span className="neon-text">AI Ready</span>
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        
                        {/* Performance Indicators */}
                        <div className="hidden md:flex items-center space-x-3">
                            <div className="flex items-center space-x-2 bg-turquoise-500/10 text-turquoise-400 px-4 py-2 rounded-full text-xs font-medium border border-turquoise-500/30">
                                <Zap className="h-4 w-4" />
                                <span>Ultra Fast</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full text-xs font-medium border border-purple-500/30">
                                <Terminal className="h-4 w-4" />
                                <span>Terminal</span>
                            </div>
                        </div>
                        
                        {/* Version Badge */}
                        <div className="hidden lg:flex items-center space-x-2 bg-slate-800/50 text-slate-400 px-3 py-2 rounded-full text-xs border border-slate-600/30">
                            <Sparkles className="h-3 w-3" />
                            <span>v2.0</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Enhanced animated bottom border */}
            <div className="h-px bg-gradient-to-r from-transparent via-turquoise-500 to-transparent opacity-50 animate-pulse"></div>
        </header>
    );
}

export default Header;