import { Router } from 'express';
import { ConversationController } from '@/conversation/conversation.controller';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { ConversationDTO } from '@/conversation/conversation.dto';

export class ConversationRoute implements Routes {
  public path = '/v1/conversations';
  public router = Router();
  public chatbot = new ConversationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.chatbot.createSession);
    this.router.get(`${this.path}/:id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})`, this.chatbot.getConversationMessages);

    this.router.post(
      `${this.path}/:id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/messages`,
      ValidationMiddleware(ConversationDTO),
      this.chatbot.chatMessage,
    );
  }
}
