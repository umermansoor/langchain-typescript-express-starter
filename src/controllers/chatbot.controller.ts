import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ChatBotService } from '@/services/chatbot.service';
import { ChatRequestDto } from '@/dtos/ChatRequestDto';

export class ChatBotController {
  private chatBotService = Container.get(ChatBotService);

  public status = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ message: 'OK' });
    } catch (error) {
      next(error);
    }
  }

  public travelAgentChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const chatRequest: ChatRequestDto = req.body;
      await this.chatBotService.travelAgentChatStream(chatRequest.message, res);
    } catch (error) {
      next(error);
    }
  }
}
