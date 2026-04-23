import type { 
  GigaChatMessage, 
  GigaChatResponse,
  GigaChatTokenResponse 
} from '../types/gigachat';
import type { AppSettings } from '../store/chatStore';

const AUTH_URL = import.meta.env.VITE_GIGACHAT_AUTH_URL;
const API_URL = import.meta.env.VITE_GIGACHAT_API_URL;
const CLIENT_ID = import.meta.env.VITE_GIGACHAT_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_GIGACHAT_CLIENT_SECRET;

export async function getAccessToken(): Promise<string> {
  const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  
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

  // Простой вариант без type-аннотации в объявлении
  const result = await response.json() as GigaChatTokenResponse;
  return result.access_token;
}

export async function getModels(token: string): Promise<string[]> {
  const response = await fetch(`${API_URL}/models`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    console.warn('Failed to fetch models, using fallback.');
    return ['GigaChat', 'GigaChat:latest'];
  }

  const result = await response.json() as GigaChatResponse;
  
  if (result.data && Array.isArray(result.data)) {
    return result.data.map((m: any) => m.id);
  }
  return ['GigaChat', 'GigaChat:latest'];
}

export async function sendMessage(
  messages: GigaChatMessage[],
  settings: Partial<AppSettings>, 
  onChunk?: (chunk: string) => void
): Promise<string> {
  const token = await getAccessToken();

  const body = {
    model: settings.model || 'GigaChat',
    messages: messages,
    temperature: settings.temperature,
    top_p: settings.top_p,
    max_tokens: settings.max_tokens,
    repetition_penalty: settings.repetition_penalty,
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

    const result = await response.json() as GigaChatResponse;
    return result.choices[0].message.content;
  }
}

async function streamCompletion(
  token: string,
  body: any,
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
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || '';
          if (content) {
            fullContent += content;
            onChunk(content);
          }
        } catch (e) { /* ignore */ }
      }
    }
  }
  return fullContent;
}
