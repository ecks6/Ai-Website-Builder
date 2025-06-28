import { NextResponse } from "next/server";
import { createAISession } from '@/configs/AiModel';
import Prompt from '@/data/Prompt';

export async function POST(req){
    const { prompt, environment = 'react', model = 'gemini-2.0-flash-exp' } = await req.json();
    let result = null; // Initialize result variable to prevent ReferenceError
    
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
        
        result = await aiSession.sendMessage(fullPrompt);
        const resp = result.response.text();
        
        // Extract JSON from the response
        let jsonString = resp;
        
        // Try to extract JSON from markdown code blocks first
        const jsonBlockMatch = resp.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonBlockMatch) {
            jsonString = jsonBlockMatch[1];
        } else {
            // If no markdown block, try to find JSON object boundaries
            const firstBrace = resp.indexOf('{');
            const lastBrace = resp.lastIndexOf('}');
            
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                jsonString = resp.substring(firstBrace, lastBrace + 1);
            }
        }
        
        // Clean up any remaining markdown or extra text
        jsonString = jsonString.trim();
        
        const parsedResponse = JSON.parse(jsonString);
        
        // Add environment and model info to response
        return NextResponse.json({
            ...parsedResponse,
            environment: environment,
            model: model
        });
    } catch(e) {
        console.error('Code Generation Error:', e);
        console.error('Raw AI Response:', result?.response?.text?.() || 'No response');
        return NextResponse.json({
            error: e.message,
            environment: environment,
            model: model,
            rawResponse: result?.response?.text?.() || 'No response available'
        }, { status: 500 });
    }
}