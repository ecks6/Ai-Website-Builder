import ChatView from '@/components/custom/ChatView';
import CodeView from '@/components/custom/CodeView';
import React from 'react';

const Workspace = () => {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0">
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#14b8a6_1px,transparent_1px),linear-gradient(to_bottom,#14b8a6_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03]"></div>
                
                {/* Floating orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-turquoise-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-turquoise-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-turquoise-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className='relative z-10 p-8'>
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-8rem)]'>
                    {/* Chat Panel */}
                    <div className='lg:col-span-1'>
                        <ChatView />
                    </div>
                    
                    {/* Code Panel */}
                    <div className='lg:col-span-3'>
                        <CodeView />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workspace;