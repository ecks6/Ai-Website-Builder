import { chatSession } from "@/configs/AiModel";
import Prompt from "@/data/Prompt";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { prompt, selectedEnv } = await req.json();

    try {
        const chatPrompt = Prompt.getPrompt('CHAT_PROMPT', selectedEnv || 'React');
        const PROMPT = prompt + " " + chatPrompt;
        
        const result = await chatSession.sendMessage(PROMPT);
        const AIResp = result.response.text();

        return NextResponse.json({ result: AIResp });
    } catch (e) {
        return NextResponse.json({ error: e.message });
    }
}