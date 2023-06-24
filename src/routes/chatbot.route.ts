import { Router } from 'express';
import { ConversationController } from '@/controllers/conversation.controller';
import { Routes } from '@interfaces/routes.interface';

export class ConversationRoute implements Routes {
  public path = '/v1/conversations';
  public router = Router();
  public chatbot = new ConversationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/travel-agent`, this.chatbot.travelAgentChat);
  }
}
