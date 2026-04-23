export interface GigaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GigaChatRequestBody {
  model: string;
  messages: GigaChatMessage[];
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
}

export interface GigaChatResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: Array<{
    index: number;
    message: GigaChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  // ✅ Добавлено для поддержки ответа /models
  data?: Array<{ id: string; [key: string]: any }>;
}

export interface GigaChatTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
