import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ConversationService } from '@/services/conversation.service';
import { ConversationRequest } from '@/dtos/conversation.dto';
import { streamToResponse, streamToString } from '@/streams/utils.stream';
import { validate } from 'class-validator';

export class ConversationController {
  private chatBotService = Container.get(ConversationService);

  public travelAgentChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const chatRequest = req.body as ConversationRequest;

      const stream = await this.chatBotService.travelAgentChat(chatRequest.messages[0].text);

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
