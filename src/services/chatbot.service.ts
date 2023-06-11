import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { CallbackManager } from 'langchain/callbacks';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';
import { TravelGuidePromptTemplate, StoryTellerPrompt } from '@/prompts/chatbot.prompt';
import { Response } from 'express';
import { HumanChatMessage, SystemChatMessage } from 'langchain/schema';



@Service()
export class ChatBotService {

  // TODO Return stream and handle in controller
  public async travelAgentChatStream(message: string, res: Response): Promise<void> {
    const chat = new ChatOpenAI({
      streaming: true,
      callbackManager: CallbackManager.fromHandlers({
        handleLLMNewToken: async token => {
          res.write(`${token}`);
        },

        handleLLMEnd: async () => {
          console.log(`END`);
          res.send();

        },
        handleLLMError: async e => {
          console.log(`ERR`);
          res.status(500).send('Something went wrong: ' + e);
        },
      }),
    });

    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(TravelGuidePromptTemplate),
      HumanMessagePromptTemplate.fromTemplate(message), // TODO: Remove format not needed
    ]);

    const formattedPrompt = await chatPrompt.formatPromptValue({
      name: 'T-100',
    });
    const messages = formattedPrompt.toChatMessages();
    await chat.call(messages);
  }

  public async storyTellerChat(message: string) : Promise<string> {
    const chat = new ChatOpenAI({ temperature: 0.7 });
    const res = await chat.call([
      new SystemChatMessage(StoryTellerPrompt),
      new HumanChatMessage(message),
    ]);

    console.log(res);

    return res.text; 
  }
}
