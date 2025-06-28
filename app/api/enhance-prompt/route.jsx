import { chatSession } from "@/configs/AiModel";
import Prompt from "@/data/Prompt";
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { prompt, selectedEnv = 'react' } = await request.json();
        
        // Get environment-specific prompt
        const enhancePromptRules = Prompt.getPrompt('ENHANCE_PROMPT_RULES', selectedEnv);
        
        const result = await chatSession.sendMessage([
            enhancePromptRules,
            `Original prompt: ${prompt}`,
            `Target environment: ${selectedEnv}`
        ]);
        
        const text = result.response.text();
        
        return NextResponse.json({
            enhancedPrompt: text.trim()
        });
    } catch (error) {
        return NextResponse.json({ 
            error: error.message,
            success: false 
        }, { status: 500 });
    }
}