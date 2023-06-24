enum Role {
  system = 'system',
  user = 'user',
}

export interface ConversationRequest {
  conversationId: string;
  timezoneOffset: number;
  messages: Message[];
}

export interface Message {
  id: string;
  text: string;
  role: Role;
}
