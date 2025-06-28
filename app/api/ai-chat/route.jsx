import { chatSession } from "@/configs/AiModel";
import Prompt from "@/data/Prompt";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { prompt, selectedEnv = 'react' } = await req.json();

    try {
        // Get environment-specific chat prompt
        const chatPrompt = Prompt.getPrompt('CHAT_PROMPT', selectedEnv);
        
        const result = await chatSession.sendMessage(prompt + chatPrompt);
        const AIResp = result.response.text();

        return NextResponse.json({ result: AIResp });
    } catch (e) {
        return NextResponse.json({ error: e.message });
    }
}