
export interface ConversationRequest {
  conversationId: string;
  timezoneOffset: number;
  messages: Message[];
}

export interface Message {
   id: string;
   text: string;
}

