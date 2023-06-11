import request from 'supertest';
import { App } from '@/app';
import { ChatBotRoute } from '@/routes/chatbot.route';


afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('TEST Chatbot Status API', () => {
  const route = new ChatBotRoute();
  const app = new App([route]);
  describe('[GET] /chatbot/status', () => {
    it('response should have the message object', () => {
      return request(app.getServer()).get('/chatbot/status').expect(200);
    });
  });
});

