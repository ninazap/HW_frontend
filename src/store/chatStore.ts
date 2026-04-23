import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Message } from '../types/message';

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  model: string;
  temperature: number;
  top_p: number;
  max_tokens: number;
  repetition_penalty: number;
}

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  isLoading: boolean;
  error: string | null;
  settings: AppSettings;
  
  // ✅ Новый список доступных моделей
  availableModels: string[];

  createChat: (title?: string) => string;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, messageId: number, content: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  searchChats: (query: string) => Chat[];
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  
  // ✅ Действие для обновления списка моделей
  setAvailableModels: (models: string[]) => void;
}

const defaultSettings: AppSettings = {
  model: 'GigaChat',
  temperature: 0.7,
  top_p: 0.9,
  max_tokens: 2048,
  repetition_penalty: 1.0
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: null,
      isLoading: false,
      error: null,
      settings: defaultSettings,
      availableModels: ['GigaChat', 'GigaChat:latest'], // ✅ Дефолтное значение

      setAvailableModels: (models) => set({ availableModels: models }),

      updateSetting: (key, value) => {
        set(state => ({
          settings: { ...state.settings, [key]: value }
        }));
      },

      createChat: (title = 'Новый чат') => {
        const newChat: Chat = {
          id: crypto.randomUUID(),
          title: title.slice(0, 40),
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set(state => ({ chats: [newChat, ...state.chats] }));
        return newChat.id;
      },

      selectChat: (chatId: string) => {
        const chat = get().chats.find(c => c.id === chatId);
        if (chat) set({ activeChatId: chatId, error: null });
      },

      deleteChat: (chatId: string) => {
        set(state => {
          const newChats = state.chats.filter(c => c.id !== chatId);
          return {
            chats: newChats,
            activeChatId: state.activeChatId === chatId ? (newChats[0]?.id ?? null) : state.activeChatId,
          };
        });
      },

      updateChatTitle: (chatId: string, title: string) => {
        set(state => ({
          chats: state.chats.map(chat =>
            chat.id === chatId ? { ...chat, title: title.slice(0, 40), updatedAt: Date.now() } : chat
          ),
        }));
      },

      addMessage: (chatId: string, message: Message) => {
        set(state => ({
          chats: state.chats.map(chat =>
            chat.id === chatId ? { ...chat, messages: [...chat.messages, message], updatedAt: Date.now() } : chat
          ),
        }));
      },

      updateMessage: (chatId: string, messageId: number, content: string) => {
        set(state => ({
          chats: state.chats.map(chat =>
            chat.id === chatId ? { ...chat, messages: chat.messages.map(msg => msg.id === messageId ? { ...msg, content } : msg), updatedAt: Date.now() } : chat
          ),
        }));
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),

      searchChats: (query: string) => {
        const { chats } = get();
        if (!query.trim()) return chats;
        const lower = query.toLowerCase();
        return chats.filter(chat => chat.title.toLowerCase().includes(lower) || chat.messages.some(m => m.content.toLowerCase().includes(lower)));
      },
    }),
    {
      name: 'gigachat-storage',
      partialize: (state) => ({
        chats: state.chats,
        activeChatId: state.activeChatId,
        settings: state.settings,
        // ✅ Сохраняем список моделей, чтобы не грузить его каждый раз
        availableModels: state.availableModels, 
      }),
    }
  )
);
