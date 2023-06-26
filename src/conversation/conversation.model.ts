export interface Message {
  id: string;
  parentId?: string;
  role: 'user' | 'ai';
  text: string;
}

export interface Conversation {
  id: string;
  parentId?: string;
  startDate: Date;
  friendlyName?: string;
  messages: Message[];
}
