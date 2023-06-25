import { Conversation, Message } from '@/conversation/conversation.model';
import { Redis } from 'ioredis';
import { Service, Inject } from 'typedi';

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
    console.log('createConversation', conversation);
    await this.redis.set(`codeahoy:${conversation.id}`, JSON.stringify(conversation));
  }

  async getConversationMetadata(conversationId: string): Promise<Conversation> {
    const conversation = await this.redis.get(`codeahoy:${conversationId}`);
    return JSON.parse(conversation);
  }

  async addMessage(conversation: Conversation, message: Message): Promise<void> {
    await this.redis.zadd(`codeahoy:${conversation.id}:messages`, Date.now().toString(), JSON.stringify(message));
  }

  async getConversation(conversationId: string, pastMessagelimit = -1): Promise<Conversation> {
    const c = await this.redis.get(`codeahoy:${conversationId}`);
    const m = await this.redis.zrevrange(`codeahoy:${conversationId}:messages`, 0, pastMessagelimit);

    console.log(m);

    const conversation = JSON.parse(c);

    conversation.messages = m.map(message => JSON.parse(message));

    return conversation;
  }
}
