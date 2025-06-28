"use client"
import React, { useState } from 'react';
import { ChevronDown, Check, Zap, AlertCircle } from 'lucide-react';
import { AI_MODELS, isOpenRouterConfigured } from '@/configs/AiModel';

function ModelSelector({ selectedModel, onModelChange, className = "" }) {
    const [isOpen, setIsOpen] = useState(false);

    const availableModels = Object.entries(AI_MODELS).map(([id, config]) => ({
        id,
        ...config
    }));

    const selectedModelConfig = AI_MODELS[selectedModel];
    const openRouterConfigured = isOpenRouterConfigured();

    // Filter models based on OpenRouter configuration
    const filteredModels = availableModels.filter(model => {
        if (model.provider === 'openrouter' && !openRouterConfigured) {
            return false;
        }
        return true;
    });

    return (
        <div className={`relative ${className}`}>
            {/* Model Selector Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex items-center justify-between w-full bg-slate-800/50 hover:bg-slate-700/50 border border-turquoise-500/20 hover:border-turquoise-500/40 rounded-xl px-4 py-3 transition-all duration-300"
            >
                <div className="flex items-center space-x-3">
                    {/* Model Icon */}
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${selectedModelConfig?.color || 'from-turquoise-500 to-cyan-500'} flex items-center justify-center text-white font-bold text-sm`}>
                        {selectedModelConfig?.icon || '🤖'}
                    </div>
                    
                    {/* Model Info */}
                    <div className="text-left">
                        <div className="text-slate-200 font-medium text-sm">
                            {selectedModelConfig?.name || 'Select Model'}
                        </div>
                        <div className="text-slate-400 text-xs">
                            {selectedModelConfig?.description || 'Choose an AI model'}
                        </div>
                    </div>
                </div>
                
                {/* Dropdown Arrow */}
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-turquoise-500/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="p-3 border-b border-slate-700/50">
                        <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-turquoise-400" />
                            <span className="text-sm font-medium text-turquoise-300">AI Models</span>
                        </div>
                    </div>

                    {/* Models List */}
                    <div className="max-h-64 overflow-y-auto">
                        {filteredModels.map((model) => (
                            <button
                                key={model.id}
                                onClick={() => {
                                    onModelChange(model.id);
                                    setIsOpen(false);
                                }}
                                className="group w-full flex items-center justify-between p-3 hover:bg-slate-700/50 transition-all duration-200"
                            >
                                <div className="flex items-center space-x-3">
                                    {/* Model Icon */}
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${model.color} flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-200`}>
                                        {model.icon}
                                    </div>
                                    
                                    {/* Model Info */}
                                    <div className="text-left">
                                        <div className="text-slate-200 font-medium text-sm group-hover:text-white transition-colors duration-200">
                                            {model.name}
                                        </div>
                                        <div className="text-slate-400 text-xs group-hover:text-slate-300 transition-colors duration-200">
                                            {model.description}
                                        </div>
                                        {/* Provider Badge */}
                                        <div className="flex items-center space-x-1 mt-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                model.provider === 'google' 
                                                    ? 'bg-blue-500/20 text-blue-400' 
                                                    : 'bg-purple-500/20 text-purple-400'
                                            }`}>
                                                {model.provider === 'google' ? 'Google' : 'OpenRouter'}
                                            </span>
                                            {model.provider === 'openrouter' && (
                                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                                                    Free
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Selection Indicator */}
                                {selectedModel === model.id && (
                                    <Check className="h-4 w-4 text-turquoise-400" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* OpenRouter Configuration Warning */}
                    {!openRouterConfigured && (
                        <div className="p-3 border-t border-slate-700/50 bg-orange-500/10">
                            <div className="flex items-start space-x-2">
                                <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                <div className="text-xs text-orange-300">
                                    <div className="font-medium">OpenRouter Not Configured</div>
                                    <div className="text-orange-400/80 mt-1">
                                        Add NEXT_PUBLIC_OPENROUTER_API_KEY to enable additional models
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}

export default ModelSelector;