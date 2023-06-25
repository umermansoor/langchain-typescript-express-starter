import { Service } from 'typedi';
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { CallbackManager } from 'langchain/callbacks';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate, MessagesPlaceholder } from 'langchain/prompts';
import { TravelGuidePromptTemplate } from '@/prompts/chatbot.prompt';
import { LangChainStream } from '@/streams/langchain.stream';
import { BufferMemory } from 'langchain/memory';

@Service()
export class ConversationService {
  private memory = new BufferMemory({ returnMessages: true, memoryKey: 'history' });

  public async travelAgentChat(message: string): Promise<ReadableStream<Uint8Array>> {
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

    return stream;
  }
}
