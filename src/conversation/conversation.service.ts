import { Service, Inject } from 'typedi';
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { CallbackManager } from 'langchain/callbacks';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate, MessagesPlaceholder } from 'langchain/prompts';
import { TravelGuidePromptTemplate } from '@/prompts/chatbot.prompt';
import { LangChainStream } from '@/streams/langchain.stream';
import { BufferMemory } from 'langchain/memory';
import { Conversation, Message } from '@/conversation/conversation.model';
import { v4 as uuidv4 } from 'uuid';
import { ConversationRepository } from '@/conversation/conversation.repository';
import { ChainValues } from 'langchain/dist/schema';
import { logger } from '@utils/logger';

@Service()
export class ConversationService {
  private memory = new BufferMemory({ returnMessages: true, memoryKey: 'history' });

  constructor(
    @Inject('ConversationRepository')
    private conversationRepository: ConversationRepository,
  ) {}

  public async createSession(): Promise<Conversation> {
    const conversation: Conversation = {
      id: uuidv4(),
      startDate: new Date(),
      messages: [],
    };

    await this.conversationRepository.createConversation(conversation);

    return conversation;
  }

  public async getConversationMessages(sessionId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.getConversation(sessionId);
    return conversation;
  }

  public async handleNewMessage(sessionId: string, message: string, messageId: string): Promise<ReadableStream<Uint8Array>> {
    const { stream, handlers } = LangChainStream();
    const chat = new ChatOpenAI({
      streaming: true,
      callbackManager: CallbackManager.fromHandlers(handlers),
    });

    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(TravelGuidePromptTemplate),
      new MessagesPlaceholder('history'),
      HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);

    const chain = new ConversationChain({
      memory: this.memory,
      prompt: chatPrompt,
      llm: chat,
    });

    const res = chain
      .call({
        input: message,
      })
      // eslint-disable-next-line no-console
      .catch(console.error);

    this.storeMessage(sessionId, message, messageId, res);

    return stream;
  }

  private async createAndStoreMessage(conversation: Conversation, id: string, role: 'user' | 'ai', text: string, parentId?: string): Promise<void> {
    const message: Message = {
      id,
      role: role,
      text: text,
      parentId: parentId,
    };

    await this.conversationRepository.addMessage(conversation, message);
  }

  private async storeMessage(id: string, message: string, messageId: string, res: Promise<void | ChainValues>): Promise<void> {
    try {
      const conversation = await this.conversationRepository.getConversationMetadata(id);
      const userMsgId = messageId ?? uuidv4();

      await this.createAndStoreMessage(conversation, userMsgId, 'user', message);

      const chainValues = await res;
      if (chainValues) {
        await this.createAndStoreMessage(conversation, uuidv4(), 'ai', chainValues.response, userMsgId);
      }
    } catch (error) {
      logger.error('Error while storing messages', error);
    }
  }
}
