import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ConversationService } from '@/conversation/conversation.service';
import { ConversationDTO } from '@/conversation/conversation.dto';
import { streamToResponse, streamToString } from '@/streams/utils.stream';

export class ConversationController {
  private chatBotService = Container.get(ConversationService);

  public createSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = await this.chatBotService.createSession();
      res.status(201).json({ id });
    } catch (error) {
      next(error);
    }
  };

  public getConversationMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId = req.params.id;
      const conversation = await this.chatBotService.getConversationMessages(sessionId);
      res.status(200).json(conversation);
    } catch (error) {
      next(error);
    }
  };

  public chatMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId = req.params.id;
      const chatRequest = req.body as ConversationDTO;

      const stream = await this.chatBotService.handleNewMessage(sessionId, chatRequest.messages[0].text, chatRequest.messages[0].id);

      const { accept } = req.headers;
      if (accept.includes('text/event-stream')) {
        streamToResponse(stream, res);
      } else {
        const response = await streamToString(stream);
        res.send(response);
      }
    } catch (error) {
      next(error);
    }
  };
}
