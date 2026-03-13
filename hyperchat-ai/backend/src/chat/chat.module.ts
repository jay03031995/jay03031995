import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ConversationService } from './conversation.service';
import { KnowledgeBaseModule } from '../knowledge-base/knowledge-base.module';

@Module({
  imports: [KnowledgeBaseModule],
  providers: [ChatGateway, ConversationService],
  exports: [ConversationService],
})
export class ChatModule {}
