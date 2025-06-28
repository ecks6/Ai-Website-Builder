import { chatSession } from "@/configs/AiModel";
import Prompt from "@/data/Prompt";
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { prompt, environment = 'react' } = await request.json();
        
        // Get environment-specific enhancement rules
        const enhanceRules = Prompt.getEnhancePromptRules(environment);
        
        const result = await chatSession.sendMessage([
            enhanceRules,
            `Original prompt: ${prompt}`,
            `Target environment: ${environment}`
        ]);
        
        const text = result.response.text();
        
        return NextResponse.json({
            enhancedPrompt: text.trim(),
            environment: environment
        });
    } catch (error) {
        return NextResponse.json({ 
            error: error.message,
            success: false 
        }, { status: 500 });
    }
}