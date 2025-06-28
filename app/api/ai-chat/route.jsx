import { createAISession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { prompt, model = 'gemini-2.0-flash-exp' } = await req.json();

    try {
        // Create AI session with selected model
        const aiSession = createAISession(model, {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
        });

        const result = await aiSession.sendMessage(prompt);
        const AIResp = result.response.text();

        return NextResponse.json({ 
            result: AIResp,
            model: model 
        });
    } catch(e) {
        console.error('AI Chat Error:', e);
        return NextResponse.json({ 
            error: e.message,
            model: model 
        }, { status: 500 });
    }
}