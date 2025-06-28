import { createAISession } from "@/configs/AiModel";
import Prompt from "@/data/Prompt";
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { prompt, environment = 'react', model = 'gemini-2.0-flash-exp' } = await request.json();
        
        // Create AI session with selected model
        const aiSession = createAISession(model, {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1000,
        });
        
        // Get environment-specific enhancement rules
        const enhanceRules = Prompt.getEnhancePromptRules(environment);
        
        const result = await aiSession.sendMessage([
            enhanceRules,
            `Original prompt: ${prompt}`,
            `Target environment: ${environment}`
        ]);
        
        const text = result.response.text();
        
        return NextResponse.json({
            enhancedPrompt: text.trim(),
            environment: environment,
            model: model
        });
    } catch (error) {
        console.error('Enhance Prompt Error:', error);
        return NextResponse.json({ 
            error: error.message,
            success: false 
        }, { status: 500 });
    }
}