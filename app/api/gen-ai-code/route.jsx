import { NextResponse } from "next/server";
import { GenAiCode } from '@/configs/AiModel';
import Prompt from '@/data/Prompt';

export async function POST(req){
    const { prompt, environment = 'react' } = await req.json();
    
    try {
        // Get environment-specific code generation prompt
        const codeGenPrompt = Prompt.getCodeGenPrompt(environment);
        
        // Combine user prompt with environment-specific instructions
        const fullPrompt = `${prompt}\n\n${codeGenPrompt}`;
        
        const result = await GenAiCode.sendMessage(fullPrompt);
        const resp = result.response.text();
        
        const parsedResponse = JSON.parse(resp);
        
        // Add environment info to response
        return NextResponse.json({
            ...parsedResponse,
            environment: environment
        });
    } catch(e) {
        return NextResponse.json({
            error: e.message,
            environment: environment
        });
    }
}