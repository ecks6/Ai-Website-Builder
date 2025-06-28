"use client"
import { createContext, useContext, useState } from 'react';

const AIModelContext = createContext();

export const useAIModel = () => {
    const context = useContext(AIModelContext);
    if (!context) {
        throw new Error('useAIModel must be used within an AIModelProvider');
    }
    return context;
};

export const AIModelProvider = ({ children }) => {
    const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash-exp');

    const value = {
        selectedModel,
        setSelectedModel
    };

    return (
        <AIModelContext.Provider value={value}>
            {children}
        </AIModelContext.Provider>
    );
};