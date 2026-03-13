import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import OpenAI from 'openai';

@Injectable()
export class KnowledgeBaseService {
  private openai: OpenAI;

  constructor(private supabaseService: SupabaseService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy',
    });
  }

  async addDocument(content: string, workspaceId: string) {
    const embedding = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: content,
    });

    const { data, error } = await this.supabaseService.getClient()
      .from('knowledge_chunks')
      .insert({
        content,
        embedding: embedding.data[0].embedding,
        workspace_id: workspaceId,
      });

    return { data, error };
  }

  async searchKnowledge(query: string, workspaceId: string) {
    const embedding = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });

    const { data, error } = await this.supabaseService.getClient().rpc('match_documents', {
      query_embedding: embedding.data[0].embedding,
      match_threshold: 0.78,
      match_count: 5,
      filter_workspace_id: workspaceId,
    });

    return data;
  }
}
