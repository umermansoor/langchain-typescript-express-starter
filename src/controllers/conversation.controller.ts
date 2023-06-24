import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ConversationService } from '@/services/conversation.service';
import { ConversationRequest } from '@/interfaces/conversation.interface';
import { HttpException } from '@/exceptions/http.exception';
import { streamToResponse, streamToString } from '@/streams/utils.stream';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class ConversationController {
  private chatBotService = Container.get(ConversationService);

  public travelAgentChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const chatRequest: ConversationRequest = plainToClass(ConversationRequest, req.body);

  

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

  private validateChatRequest = async (chatRequest: ConversationRequest): Promise<boolean> => {
    const errors = await validate(chatRequest);
    if (errors.length > 0) {
      console.log('Validation failed. errors: ', errors);
      return false;
    }
    return true;
  };
}
