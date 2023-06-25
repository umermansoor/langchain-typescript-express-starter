import { Conversation, Message } from '@/conversation/conversation.model';
import { Redis } from 'ioredis';
import { Service, Inject } from 'typedi';
import { logger } from '@utils/logger';
import { RedisOperationException } from '@/exceptions/redis.exception';
import { NotFoundException } from '@/exceptions/notfound.exception';

export interface ConversationRepository {
  addMessage(conversation: Conversation, message: Message): Promise<void>;
  // getConversation(conversationId: string): Promise<Conversation>;
  createConversation(conversation: Conversation): Promise<void>;
  getConversationMetadata(conversationId: string): Promise<Conversation>;
  getConversation(conversationId: string, pastMessagelimit?: number): Promise<Conversation>;
}

@Service('ConversationRepository')
export class RedisConversationRepository implements ConversationRepository {
  constructor(@Inject() private redis: Redis) {}

  async createConversation(conversation: Conversation): Promise<void> {
    try {
      await this.redis.set(`codeahoy:${conversation.id}`, JSON.stringify(conversation));
    } catch (err) {
      logger.error('Error creating conversation', err);
      throw new RedisOperationException(`Error creating conversation: ${err.message}`);
    }
  }

  async getConversationMetadata(conversationId: string): Promise<Conversation> {
    try {
      const conversation = await this.redis.get(`codeahoy:${conversationId}`);
      if (!conversation) {
        throw new NotFoundException(`Conversation with ID ${conversationId} not found`);
      }

      return JSON.parse(conversation);
    } catch (err) {
      logger.error('Error getting conversation metadata', err);
      throw new RedisOperationException(`Error getting conversation metadata: ${err.message}`);
    }
  }

  async addMessage(conversation: Conversation, message: Message): Promise<void> {
    try {
      await this.redis.zadd(`codeahoy:${conversation.id}:messages`, Date.now().toString(), JSON.stringify(message));
    } catch (err) {
      logger.error('Error adding message', err);
      throw new RedisOperationException(`Error adding message: ${err.message}`);
    }
  }

  async getConversation(conversationId: string, pastMessagelimit = -1): Promise<Conversation> {
    try {
      const c = await this.redis.get(`codeahoy:${conversationId}`);
      if (!c) {
        throw new NotFoundException(`Conversation with ID ${conversationId} not found`);
      }
      const m = await this.redis.zrevrange(`codeahoy:${conversationId}:messages`, 0, pastMessagelimit);

      const conversation = JSON.parse(c);
      conversation.messages = m.map(message => JSON.parse(message));
      return conversation;
    } catch (err) {
      logger.error('Error getting conversation', err);
      throw new RedisOperationException(`Error getting conversation: ${err.message}`);
    }
  }
}