import type { 
  GigaChatMessage, 
  GigaChatRequestBody, 
  GigaChatResponse,
  GigaChatTokenResponse 
} from '../types/gigachat';

const AUTH_URL = import.meta.env.VITE_GIGACHAT_AUTH_URL;
const API_URL = import.meta.env.VITE_GIGACHAT_API_URL;
const CLIENT_ID = import.meta.env.VITE_GIGACHAT_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_GIGACHAT_CLIENT_SECRET;

// Получение access token
export async function getAccessToken(): Promise<string> {
  // Формируем Basic Auth: либо из client_id:secret, либо используем готовый ключ
  const authKey = import.meta.env.VITE_GIGACHAT_AUTH_KEY;
  const credentials = authKey || btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  
  const response = await fetch(AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': `Basic ${credentials}`,
      'RqUID': crypto.randomUUID(),
    },
    body: 'scope=GIGACHAT_API_PERS',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Auth error:', response.status, errorText);
    throw new Error(`Failed to get access token: ${response.status}`);
  }

  // ✅ Исправлено: было "const  GigaChatTokenResponse" (опечатка)
  const data: GigaChatTokenResponse = await response.json();
  return data.access_token;
}

// Отправка сообщения
export async function sendMessage(
  messages: GigaChatMessage[],
  onChunk?: (chunk: string) => void
): Promise<string> {
  const token = await getAccessToken();

  const body: GigaChatRequestBody = {
    model: 'GigaChat',
    messages: messages,
    temperature: 0.7,
    stream: !!onChunk,
  };

  if (onChunk) {
    return streamCompletion(token, body, onChunk);
  } else {
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    // ✅ Исправлено: было "const  GigaChatResponse" (опечатка)
    const data: GigaChatResponse = await response.json();
    return data.choices[0].message.content;
  }
}

// Streaming completion (SSE)
async function streamCompletion(
  token: string,
  body: GigaChatRequestBody,
  onChunk: (chunk: string) => void
): Promise<string> {
  const response = await fetch(`${API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ ...body, stream: true }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Stream error:', response.status, errorText);
    throw new Error(`API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith(' ')) {
        const data = line.slice(6);
        
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || '';
          if (content) {
            fullContent += content;
            onChunk(content);
          }
        } catch (e) {
          console.warn('Failed to parse SSE chunk:', e);
        }
      }
    }
  }

  return fullContent;
}

// Генерация названия чата
export async function generateChatTitle(firstMessage: string): Promise<string> {
  try {
    const token = await getAccessToken();
    
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: 'GigaChat',
        messages: [
          { 
            role: 'system', 
            content: 'Создай короткое название для чата (максимум 30 символов). Отвечай только названием.' 
          },
          { 
            role: 'user', 
            content: firstMessage.slice(0, 100) 
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate title: ${response.status}`);
    }

    const data: GigaChatResponse = await response.json();
    const title = data.choices[0].message.content.trim();
    
    return title.slice(0, 40) || 'Новый чат';
  } catch (error) {
    console.error('Failed to generate title:', error);
    return 'Новый чат';
  }
}
