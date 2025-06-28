"use client"
import React, { useContext, useState, useEffect } from 'react';
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackFileExplorer
} from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';
import { MessagesContext } from '@/context/MessagesContext';
import axios from 'axios';
import Prompt from '@/data/Prompt';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { Loader2Icon, Download, Code, Eye, FileText, Zap, Globe } from 'lucide-react';
import JSZip from 'jszip';

function CodeView() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('code');
    const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
    const [selectedEnv, setSelectedEnv] = useState('react'); // Environment state
    const { messages } = useContext(MessagesContext);
    const UpdateFiles = useMutation(api.workspace.UpdateFiles);
    const convex = useConvex();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        id && GetFiles();
    }, [id])

    const GetFiles = async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        });
        
        // Set environment from workspace
        const env = result?.selectedEnv || 'react';
        setSelectedEnv(env);
        
        // Get appropriate default files for environment
        const defaultFiles = Lookup.getDefaultFiles(env);
        const processedFiles = preprocessFiles(result?.fileData || {});
        const mergedFiles = { ...defaultFiles, ...processedFiles };
        setFiles(mergedFiles);
    }

    const preprocessFiles = (files) => {
        const processed = {};
        Object.entries(files).forEach(([path, content]) => {
            if (typeof content === 'string') {
                processed[path] = { code: content };
            } else if (content && typeof content === 'object') {
                if (!content.code && typeof content === 'object') {
                    processed[path] = { code: JSON.stringify(content, null, 2) };
                } else {
                    processed[path] = content;
                }
            }
        });
        return processed;
    }

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role === 'user') {
                GenerateAiCode();
            }
        }
    }, [messages])

    const GenerateAiCode = async () => {
        setLoading(true);
        const PROMPT = JSON.stringify(messages) + " " + Prompt.getPrompt('CODE_GEN_PROMPT', selectedEnv);
        const result = await axios.post('/api/gen-ai-code', {
            prompt: PROMPT,
            selectedEnv: selectedEnv // Pass environment to API
        });

        const processedAiFiles = preprocessFiles(result.data?.files || {});
        const defaultFiles = Lookup.getDefaultFiles(selectedEnv);
        const mergedFiles = { ...defaultFiles, ...processedAiFiles };
        setFiles(mergedFiles);

        await UpdateFiles({
            workspaceId: id,
            files: result.data?.files
        });
        setLoading(false);
    }

    const downloadFiles = async () => {
        try {
            const zip = new JSZip();

            Object.entries(files).forEach(([filename, content]) => {
                let fileContent;
                if (typeof content === 'string') {
                    fileContent = content;
                } else if (content && typeof content === 'object') {
                    if (content.code) {
                        fileContent = content.code;
                    } else {
                        fileContent = JSON.stringify(content, null, 2);
                    }
                }

                if (fileContent) {
                    const cleanFileName = filename.startsWith('/') ? filename.slice(1) : filename;
                    zip.file(cleanFileName, fileContent);
                }
            });

            // Add package.json only for React projects
            if (selectedEnv === 'react') {
                const packageJson = {
                    name: "ai-generated-react-project",
                    version: "1.0.0",
                    private: true,
                    dependencies: Lookup.DEPENDANCY,
                    scripts: {
                        "dev": "vite",
                        "build": "vite build",
                        "preview": "vite preview"
                    }
                };
                zip.file("package.json", JSON.stringify(packageJson, null, 2));
            }

            const blob = await zip.generateAsync({ type: "blob" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ai-${selectedEnv}-project.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading files:', error);
        }
    };

    // Get template based on environment
    const getTemplate = () => {
        return selectedEnv === 'html' ? 'vanilla' : 'react';
    };

    return (
        <div className='relative'>
            {/* Enhanced Header */}
            <div className='glass-dark border-2 border-turquoise-500/20 rounded-t-2xl p-4'>
                <div className='flex items-center justify-between'>
                    {/* Tab Switcher */}
                    <div className='flex items-center bg-slate-800/50 p-1 rounded-xl border border-turquoise-500/20'>
                        <button
                            onClick={() => setActiveTab('code')}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                                activeTab === 'code' 
                                    ? 'bg-gradient-to-r from-turquoise-500 to-cyan-500 text-white shadow-lg neon-turquoise' 
                                    : 'text-slate-400 hover:text-turquoise-400 hover:bg-slate-700/50'
                            }`}
                        >
                            <Code className="h-4 w-4" />
                            <span>Code Editor</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                                activeTab === 'preview' 
                                    ? 'bg-gradient-to-r from-turquoise-500 to-cyan-500 text-white shadow-lg neon-turquoise' 
                                    : 'text-slate-400 hover:text-turquoise-400 hover:bg-slate-700/50'
                            }`}
                        >
                            <Eye className="h-4 w-4" />
                            <span>Live Preview</span>
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        {/* Environment Indicator */}
                        <div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-turquoise-500/20">
                            {selectedEnv === 'react' ? (
                                <Code className="h-4 w-4 text-blue-400" />
                            ) : (
                                <Globe className="h-4 w-4 text-orange-400" />
                            )}
                            <span className="text-sm text-slate-300 font-medium">
                                {selectedEnv === 'react' ? 'React + Vite' : 'HTML/CSS/JS'}
                            </span>
                        </div>

                        {/* File Count */}
                        <div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-turquoise-500/20">
                            <FileText className="h-4 w-4 text-turquoise-400" />
                            <span className="text-sm text-slate-300">{Object.keys(files).length} files</span>
                        </div>

                        {/* Download Button */}
                        <button
                            onClick={downloadFiles}
                            className="group relative flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover-lift"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                            <Download className="h-5 w-5 relative z-10" />
                            <span className="relative z-10">Export Project</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Code Environment */}
            <div className="relative">
                <SandpackProvider 
                    files={files}
                    template={getTemplate()}
                    theme={{
                        colors: {
                            surface1: '#0f172a',
                            surface2: '#1e293b',
                            surface3: '#334155',
                            clickable: '#14b8a6',
                            base: '#e2e8f0',
                            disabled: '#64748b',
                            hover: '#06b6d4',
                            accent: '#14b8a6',
                            error: '#ef4444',
                            errorSurface: '#7f1d1d',
                            warning: '#f59e0b',
                            warningSurface: '#78350f'
                        },
                        syntax: {
                            plain: '#e2e8f0',
                            comment: '#64748b',
                            keyword: '#14b8a6',
                            tag: '#06b6d4',
                            punctuation: '#94a3b8',
                            definition: '#f472b6',
                            property: '#fbbf24',
                            static: '#8b5cf6',
                            string: '#10b981'
                        },
                        font: {
                            body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                            mono: '"Fira Code", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
                            size: '14px',
                            lineHeight: '1.6'
                        }
                    }}
                    customSetup={selectedEnv === 'react' ? {
                        dependencies: {
                            ...Lookup.DEPENDANCY
                        },
                        entry: '/index.js'
                    } : undefined}
                    options={{
                        externalResources: selectedEnv === 'react' ? ['https://cdn.tailwindcss.com'] : [],
                        bundlerTimeoutSecs: 120,
                        recompileMode: "immediate",
                        recompileDelay: 300,
                        showNavigator: true,
                        showTabs: true,
                        showLineNumbers: true,
                        showInlineErrors: true,
                        wrapContent: true,
                        editorHeight: '80vh'
                    }}
                >
                    <div className="border-2 border-turquoise-500/20 border-t-0 rounded-b-2xl overflow-hidden">
                        <SandpackLayout>
                            {activeTab === 'code' ? (
                                <>
                                    <SandpackFileExplorer 
                                        style={{ 
                                            height: '80vh',
                                            background: '#0f172a',
                                            borderRight: '1px solid rgba(20, 184, 166, 0.2)'
                                        }} 
                                    />
                                    <SandpackCodeEditor 
                                        style={{ 
                                            height: '80vh',
                                            background: '#0f172a'
                                        }}
                                        showTabs
                                        showLineNumbers
                                        showInlineErrors
                                        wrapContent 
                                    />
                                </>
                            ) : (
                                <SandpackPreview 
                                    style={{ 
                                        height: '80vh',
                                        background: '#0f172a'
                                    }} 
                                    showNavigator={true}
                                    showOpenInCodeSandbox={false}
                                    showRefreshButton={true}
                                />
                            )}
                        </SandpackLayout>
                    </div>
                </SandpackProvider>

                {/* Loading Overlay */}
                {loading && (
                    <div className='absolute inset-0 glass-dark rounded-2xl flex items-center justify-center z-50'>
                        <div className="text-center space-y-6">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-turquoise-500/20 rounded-full"></div>
                                <div className="absolute inset-0 w-20 h-20 border-4 border-turquoise-500 rounded-full border-t-transparent animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Zap className="h-8 w-8 text-turquoise-400 animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-turquoise-400">
                                    Generating {selectedEnv === 'react' ? 'React' : 'HTML'} Code
                                </h3>
                                <p className="text-slate-400">
                                    AI is crafting your {selectedEnv === 'react' ? 'React components' : 'web pages'}...
                                </p>
                                <div className="flex justify-center space-x-1">
                                    <div className="w-2 h-2 bg-turquoise-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-turquoise-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-turquoise-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CodeView;