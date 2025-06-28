import { NextResponse } from "next/server";
import { createAISession } from '@/configs/AiModel';
import Prompt from '@/data/Prompt';

export async function POST(req){
    const { prompt, environment = 'react', model = 'gemini-2.0-flash-exp' } = await req.json();
    
    try {
        // Create AI session with selected model
        const aiSession = createAISession(model, {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 10192,
            responseMimeType: "application/json",
        });
        
        // Get environment-specific code generation prompt
        const codeGenPrompt = Prompt.getCodeGenPrompt(environment);
        
        // Combine the environment-specific prompt with user input
        const fullPrompt = `${prompt}\n\n${codeGenPrompt}`;
        
        const result = await aiSession.sendMessage(fullPrompt);
        const resp = result.response.text();
        
        const parsedResponse = JSON.parse(resp);
        
        // Add environment and model info to response
        return NextResponse.json({
            ...parsedResponse,
            environment: environment,
            model: model
        });
    } catch(e) {
        console.error('Code Generation Error:', e);
        return NextResponse.json({
            error: e.message,
            environment: environment,
            model: model
        }, { status: 500 });
    }
}