"use client";

import React from 'react';
import { ConvexProvider, ConvexReactClient } from "convex/react";

const ConvexClientProvider = ({ children }) => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    
    // Check if Convex URL is provided
    if (!convexUrl) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center space-y-4 p-8 bg-slate-900 rounded-lg border border-red-500/20">
                    <h2 className="text-xl font-bold text-red-400">Configuration Required</h2>
                    <p className="text-slate-300 max-w-md">
                        Convex URL is not configured. Please:
                    </p>
                    <ol className="text-left text-sm text-slate-400 space-y-2">
                        <li>1. Run <code className="bg-slate-800 px-2 py-1 rounded">npx convex dev</code></li>
                        <li>2. Copy the provided Convex URL</li>
                        <li>3. Add it to your .env.local file as NEXT_PUBLIC_CONVEX_URL</li>
                        <li>4. Restart the development server</li>
                    </ol>
                </div>
            </div>
        );
    }

    const convex = new ConvexReactClient(convexUrl);
    
    return (
        <ConvexProvider client={convex}>
            {children}
        </ConvexProvider>
    );
};

export default ConvexClientProvider;