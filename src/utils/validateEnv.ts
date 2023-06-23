import { cleanEnv, str } from 'envalid';

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    OPENAI_API_KEY: str(),
  });
};
