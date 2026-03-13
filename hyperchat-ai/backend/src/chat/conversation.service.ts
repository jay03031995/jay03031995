import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';
import OpenAI from 'openai';

@Injectable()
export class ConversationService {
  private openai: OpenAI;

  constructor(
    private supabaseService: SupabaseService,
    private knowledgeBaseService: KnowledgeBaseService,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy',
    });
  }

  async processMessage(visitorMessage: string, conversationId: string, workspaceId: string) {
    const context = await this.knowledgeBaseService.searchKnowledge(visitorMessage, workspaceId);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant for HyperChat. Use the following context to answer the user query. Context: ' + JSON.stringify(context) },
        { role: 'user', content: visitorMessage }
      ],
    });

    const aiMessage = response.choices[0].message.content || '';

    await this.supabaseService.getClient().from('messages').insert([
      { conversation_id: conversationId, content: visitorMessage, sender_type: 'visitor' },
      { conversation_id: conversationId, content: aiMessage, sender_type: 'ai' }
    ]);

    return aiMessage;
  }
}
