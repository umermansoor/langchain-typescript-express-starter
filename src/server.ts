import { App } from '@/app';
import { ChatBotRoute } from '@/routes/chatbot.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new ChatBotRoute()]);

app.listen();
