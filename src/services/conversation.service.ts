import { Service } from 'typedi';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { CallbackManager } from 'langchain/callbacks';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts';
import { TravelGuidePromptTemplate } from '@/prompts/chatbot.prompt';
import { LangChainStream } from '@/streams/langchain.stream';

@Service()
export class ConversationService {
  public async travelAgentChat(message: string): Promise<ReadableStream<Uint8Array>> {
    const { stream, handlers } = LangChainStream();
    const llm = new ChatOpenAI({
      streaming: true,
      callbackManager: CallbackManager.fromHandlers(handlers),
    });

    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(TravelGuidePromptTemplate),
      HumanMessagePromptTemplate.fromTemplate(message), // TODO: Remove format not needed
    ]);

    const formattedPrompt = await chatPrompt.formatPromptValue({
      name: 'T-100',
    });
    const messages = formattedPrompt.toChatMessages();

    llm
      .call(messages)
      // eslint-disable-next-line no-console
      .catch(console.error);

    return stream;
  }
}
