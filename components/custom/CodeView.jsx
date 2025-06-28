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
import { useAIModel } from '@/context/AIModelContext';
import axios from 'axios';
import Prompt from '@/data/Prompt';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { Loader2Icon, Download, Code, Eye, FileText, Zap, Globe, Layers, Play } from 'lucide-react';
import JSZip from 'jszip';

function CodeView() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('code');
    const [files, setFiles] = useState({});
    const [environment, setEnvironment] = useState('react');
    const { selectedModel } = useAIModel();
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
        const workspaceEnvironment = result?.environment || 'react';
        setEnvironment(workspaceEnvironment);
        
        // Get default files for the environment
        const defaultFiles = Lookup.getDefaultFiles(workspaceEnvironment);
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
            const lastMessage = messages[messages?.length - 1];
            if (lastMessage.role === 'user') {
                GenerateAiCode();
            }
        }
    }, [messages])

    const GenerateAiCode = async () => {
        setLoading(true);
        const lastMessage = messages[messages?.length - 1];
        const messageEnvironment = lastMessage?.environment || environment;
        const messageModel = lastMessage?.model || selectedModel;
        
        const PROMPT = JSON.stringify(messages) + " " + Prompt.getCodeGenPrompt(messageEnvironment);
        
        const result = await axios.post('/api/gen-ai-code', {
            prompt: PROMPT,
            environment: messageEnvironment,
            model: messageModel
        });

        const processedAiFiles = preprocessFiles(result.data?.files || {});
        const defaultFiles = Lookup.getDefaultFiles(messageEnvironment);
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
            if (environment === 'react') {
                const packageJson = {
                    name: "ai-generated-project",
                    version: "1.0.0",
                    private: true,
                    dependencies: Lookup.getDependencies(environment),
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
            a.download = `ai-${environment}-project.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading files:', error);
        }
    };

    // Get environment icon and info
    const getEnvironmentInfo = () => {
        if (environment === 'html') {
            return {
                icon: Globe,
                name: 'HTML/CSS/JS',
                color: 'from-orange-500 to-red-500'
            };
        }
        return {
            icon: Code,
            name: 'React',
            color: 'from-blue-500 to-cyan-500'
        };
    };

    const envInfo = getEnvironmentInfo();
    const EnvIcon = envInfo.icon;

    // Get Sandpack template and setup based on environment
    const getSandpackConfig = () => {
        if (environment === 'html') {
            return {
                template: 'vanilla',
                customSetup: {
                    dependencies: {},
                    entry: '/index.html'
                },
                options: {
                    externalResources: ['https://cdn.tailwindcss.com'],
                    bundlerTimeoutSecs: 120,
                    recompileMode: "immediate",
                    recompileDelay: 300,
                    showNavigator: true,
                    showTabs: true,
                    showLineNumbers: true,
                    showInlineErrors: true,
                    wrapContent: true,
                    editorHeight: 'calc(85vh - 80px)'
                }
            };
        }
        
        return {
            template: 'react',
            customSetup: {
                dependencies: {
                    ...Lookup.getDependencies(environment)
                },
                entry: '/index.js'
            },
            options: {
                externalResources: ['https://cdn.tailwindcss.com'],
                bundlerTimeoutSecs: 120,
                recompileMode: "immediate",
                recompileDelay: 300,
                showNavigator: true,
                showTabs: true,
                showLineNumbers: true,
                showInlineErrors: true,
                wrapContent: true,
                editorHeight: 'calc(85vh - 80px)'
            }
        };
    };

    const sandpackConfig = getSandpackConfig();

    return (
        <div className='relative h-[85vh] flex flex-col'>
            {/* Compact Header */}
            <div className='glass-dark border-2 border-turquoise-500/20 rounded-t-2xl p-3'>
                <div className='flex items-center justify-between'>
                    {/* Tab Switcher */}
                    <div className='flex items-center bg-slate-800/50 p-1 rounded-lg border border-turquoise-500/20'>
                        <button
                            onClick={() => setActiveTab('code')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                                activeTab === 'code' 
                                    ? 'bg-gradient-to-r from-turquoise-500 to-cyan-500 text-white shadow-lg neon-turquoise' 
                                    : 'text-slate-400 hover:text-turquoise-400 hover:bg-slate-700/50'
                            }`}
                        >
                            <Code className="h-4 w-4" />
                            <span>Code</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                                activeTab === 'preview' 
                                    ? 'bg-gradient-to-r from-turquoise-500 to-cyan-500 text-white shadow-lg neon-turquoise' 
                                    : 'text-slate-400 hover:text-turquoise-400 hover:bg-slate-700/50'
                            }`}
                        >
                            <Eye className="h-4 w-4" />
                            <span>Preview</span>
                        </button>

                        {/* Run Button - Only show for HTML environment */}
                        {environment === 'html' && (
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                                    activeTab === 'run' 
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                                        : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50'
                                }`}
                            >
                                <Play className="h-4 w-4" />
                                <span>Run</span>
                            </button>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        {/* Environment Indicator */}
                        <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-turquoise-500/20">
                            <EnvIcon className="h-4 w-4 text-turquoise-400" />
                            <span className="text-sm text-slate-300">{envInfo.name}</span>
                        </div>

                        {/* File Count */}
                        <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-turquoise-500/20">
                            <FileText className="h-4 w-4 text-turquoise-400" />
                            <span className="text-sm text-slate-300">{Object.keys(files).length}</span>
                        </div>

                        {/* Download Button */}
                        <button
                            onClick={downloadFiles}
                            className="group relative flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-lift text-sm"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                            <Download className="h-4 w-4 relative z-10" />
                            <span className="relative z-10">Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Code Environment - Using Sandpack for both React and HTML */}
            <div className="relative flex-1 overflow-hidden">
                <SandpackProvider 
                    files={files}
                    template={sandpackConfig.template}
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
                    customSetup={sandpackConfig.customSetup}
                    options={sandpackConfig.options}
                >
                    <div className="border-2 border-turquoise-500/20 border-t-0 rounded-b-2xl overflow-hidden h-full">
                        <SandpackLayout>
                            {activeTab === 'code' ? (
                                <>
                                    <SandpackFileExplorer 
                                        style={{ 
                                            height: 'calc(85vh - 80px)',
                                            background: '#0f172a',
                                            borderRight: '1px solid rgba(20, 184, 166, 0.2)'
                                        }} 
                                    />
                                    <SandpackCodeEditor 
                                        style={{ 
                                            height: 'calc(85vh - 80px)',
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
                                        height: 'calc(85vh - 80px)',
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
                                <h3 className="text-xl font-bold text-turquoise-400">Generating {envInfo.name} Code</h3>
                                <p className="text-slate-400">AI is crafting your {environment} project with {selectedModel}...</p>
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