import { Router } from 'express';
import { ChatBotController } from '@/controllers/chatbot.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { ChatRequestDto } from '@/dtos/ChatRequestDto';

export class ChatBotRoute implements Routes {
  public path = '/chatbot';
  public router = Router();
  public chatbot = new ChatBotController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/status`, this.chatbot.status);
    this.router.post(`${this.path}/chat/`, validationMiddleware(ChatRequestDto, 'body', true), this.chatbot.travelAgentChat);
  }
}
