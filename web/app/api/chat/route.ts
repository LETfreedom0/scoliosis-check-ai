import { NextResponse } from 'next/server';
import { ModelFactory } from '@/lib/models/factory';
import { ModelProviderName, ChatMessage } from '@/lib/models/types';
import { getAnalysisPrompt } from '@/lib/prompts';

export async function POST(request: Request) {
  try {
    const { messages, model = 'glm-4.6v', language = 'zh-CN' } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const providerName: ModelProviderName = model as ModelProviderName;
    const provider = ModelFactory.create(providerName);
    
    console.log(`Starting chat with model: ${providerName}, lang: ${language}`);

    const systemPrompt = getAnalysisPrompt('chat', language);
    const systemMessage: ChatMessage = {
      role: 'system',
      content: systemPrompt
    };
    
    // Filter out any existing system messages from client to avoid duplication/override
    const clientMessages = messages.filter((m: ChatMessage) => m.role !== 'system');
    const messagesWithSystem = [systemMessage, ...clientMessages];

    try {
      const reply = await provider.chat(messagesWithSystem);
      return NextResponse.json({ reply });
    } catch (err: any) {
       console.error('Model Chat Error:', err);
       return NextResponse.json(
        { error: err.message || 'Model Chat Failed' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
