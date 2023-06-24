import { App } from '@/app';
import { ConversationRoute } from '@/routes/conversation.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new ConversationRoute()]);
app.listen();
