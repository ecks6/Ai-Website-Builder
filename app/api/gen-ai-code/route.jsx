import { NextResponse } from "next/server";
import { GenAiCode } from '@/configs/AiModel';
import Prompt from "@/data/Prompt";

export async function POST(req) {
    const { prompt, selectedEnv } = await req.json();
    
    try {
        const codeGenPrompt = Prompt.getPrompt('CODE_GEN_PROMPT', selectedEnv || 'React');
        const PROMPT = prompt + " " + codeGenPrompt;
        
        const result = await GenAiCode.sendMessage(PROMPT);
        const resp = result.response.text();
        return NextResponse.json(JSON.parse(resp));
    } catch (e) {
        return NextResponse.json({ error: e.message });
    }
}