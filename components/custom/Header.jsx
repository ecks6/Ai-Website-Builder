import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

function Header() {
    return (
        <header className="border-b border-turquoise-500/20 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 glass-dark">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo and Title */}
                    <Link href="/" className="flex items-center space-x-4 group cursor-pointer">
                        <div className="relative">
                            {/* Logo SVG with gentle breathing animation */}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 16 16" 
                                width="32" 
                                height="32"
                                className="animate-breathe transition-transform duration-300 group-hover:scale-110"
                            >
                                {/* Blocurile colorate aranjate conform imaginii atașate */}
                                {/* Rândul 1 (de jos) */}
                                <rect x="1.5" y="11" width="2.5" height="2.5" rx="0.5" fill="#E74C3C" />
                                {/* Rândul 2 */}
                                <rect x="1.5" y="7.5" width="2.5" height="2.5" rx="0.5" fill="#F1C40F" />
                                <rect x="5" y="7.5" width="2.5" height="2.5" rx="0.5" fill="#27AE60" />
                                {/* Rândul 3 */}
                                <rect x="1.5" y="4" width="2.5" height="2.5" rx="0.5" fill="#F39C12" />
                                <rect x="5" y="4" width="2.5" height="2.5" rx="0.5" fill="#2ECC71" />
                                <rect x="8.5" y="4" width="2.5" height="2.5" rx="0.5" fill="#3498DB" />
                                {/* Rândul 4 (de sus) */}
                                <rect x="5" y="0.5" width="2.5" height="2.5" rx="0.5" fill="#2ECC71" />
                                <rect x="8.5" y="0.5" width="2.5" height="2.5" rx="0.5" fill="#3498DB" />
                                <rect x="12" y="0.5" width="2.5" height="2.5" rx="0.5" fill="#3498DB" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-turquoise-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                                LanSoft Dev
                            </h1>
                            <p className="text-xs text-turquoise-300/70 font-medium tracking-wide">
                                Next-Gen Development
                            </p>
                        </div>
                    </Link>

                    {/* Interactive Status Badge */}
                    <div className="flex items-center space-x-4">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-turquoise-400 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                            <div className="relative flex items-center space-x-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-6 py-3 rounded-full text-sm font-semibold border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer hover-lift">
                                <div className="relative">
                                    <Sparkles className="h-5 w-5 animate-spin-slow" />
                                    <div className="absolute inset-0 bg-emerald-400 rounded-full blur-sm opacity-50 animate-pulse"></div>
                                </div>
                                <span className="text-neon">AI Ready</span>
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        
                        {/* Performance Indicator */}
                        <div className="hidden md:flex items-center space-x-2 bg-turquoise-500/10 text-turquoise-400 px-4 py-2 rounded-full text-xs font-medium border border-turquoise-500/30">
                            <Zap className="h-4 w-4" />
                            <span>Ultra Fast</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Animated bottom border */}
            <div className="h-px bg-gradient-to-r from-transparent via-turquoise-500 to-transparent opacity-50"></div>
        </header>
    );
}

export default Header;