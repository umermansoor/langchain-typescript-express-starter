import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ConversationService } from '@/services/conversation.service';
import { ConversationRequest } from '@/interfaces/conversation.interface';
import { HttpException } from '@/exceptions/http.exception';
import { streamToResponse, streamToString } from '@/streams/utils.stream';

export class ConversationController {
  private chatBotService = Container.get(ConversationService);

  public travelAgentChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const chatRequest: ConversationRequest = req.body;
      if (!this.validateChatRequest(chatRequest)) {
        next(new HttpException(400, 'Invalid chat request'));
        return;
      }

      const stream = await this.chatBotService.travelAgentChat(chatRequest.messages[0].text);

      const accept = req.headers.accept || '';
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

  private validateChatRequest = (chatRequest: ConversationRequest): boolean => {
    // TODO: Validate chatRequest
    // TODO: Consider using Middleware and class-validator if it works for nested objects & non-primitive array

    return true;
  };
}
