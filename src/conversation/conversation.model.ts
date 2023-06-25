export interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export interface Conversation {
  id: string;
  startDate: Date;
  friendlyName?: string;
  messages: Message[];
}
