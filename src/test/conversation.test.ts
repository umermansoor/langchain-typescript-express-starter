import request from 'supertest';
import { App } from '@/app';
import { ConversationRoute } from '@/routes/main.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

// Write test for /v1/conversations/travel-agent
describe('TEST Conversation Travel Agent API', () => {
  const route = new ConversationRoute();
  const app = new App([route]);
  describe('[POST] /v1/conversations/travel-agent', () => {
    it('response should have the message object', () => {
      return request(app.getServer())
        .post('/v1/conversations/travel-agent')
        .send({
          messages: [
            {
              text: 'Hello',
            },
          ],
        })
        .expect(200);
    });
  });
});
