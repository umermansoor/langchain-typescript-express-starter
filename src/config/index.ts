import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const getEnv = (key: string, defaultValue: string) => {
  const value = process.env[key];
  if (!value) {
    return defaultValue;
  }
  return value;
};

export const NODE_ENV = getEnv('NODE_ENV', 'development');
export const PORT = getEnv('PORT', '3000');
export const LOG_FORMAT = getEnv('LOG_FORMAT', 'dev');
export const LOG_DIR = getEnv('LOG_DIR', '../logs');
export const ORIGIN = getEnv('ORIGIN', '*');
export const CREDENTIALS = getEnv('CREDENTIALS', 'true') === 'true'; // This converts the string to a boolean
