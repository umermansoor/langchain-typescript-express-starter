import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ChatBotService } from '@/services/chatbot.service';

export class ChatBotController {
  private chatBotService = Container.get(ChatBotService);

  public status = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ message: 'OK' });
    } catch (error) {
      next(error);
    }
  }

  public chatStream = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const message = req.body.message;
      if (!message) {
        res.status(400).send('`message` field is required');
      } else {
        await this.chatBotService.travelAgentChatStream(message, res);
      }

    } catch (error) {
      next(error);
    }
  }

  public chat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const message = req.body.message;
      if (!message) {
        res.status(400).send('`message` field is required');
      } else {
        const r = await this.chatBotService.storyTellerChat(message);
        res.status(200).send(r);
      }

    } catch (error) {
      next(error);
    }
  }
}
