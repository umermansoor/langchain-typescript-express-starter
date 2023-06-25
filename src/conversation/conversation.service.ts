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

  public async handleNewMessage(sessionId: string, message: string): Promise<ReadableStream<Uint8Array>> {
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

    chain
      .call({
        input: message,
      })
      // eslint-disable-next-line no-console
      .catch(console.error);

    const conversation = await this.conversationRepository.getConversationMetadata(sessionId);
    const msg: Message = {
      id: uuidv4(),
      role: 'user',
      text: message,
    };

    this.conversationRepository.addMessage(conversation, msg);

    return stream;
  }
}
