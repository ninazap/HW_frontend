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

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  isLoading: boolean;
  error: string | null;
  
  createChat: (title?: string) => string;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, messageId: number, content: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  searchChats: (query: string) => Chat[];
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: null,
      isLoading: false,
      error: null,

      createChat: (title = 'Новый чат') => {
        const newChat: Chat = {
          id: crypto.randomUUID(),
          title: title.slice(0, 40),
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set(state => ({
          chats: [newChat, ...state.chats],
        }));
        
        return newChat.id;
      },

      selectChat: (chatId: string) => {
        const chat = get().chats.find(c => c.id === chatId);
        if (chat) {
          set({ activeChatId: chatId, error: null });
        }
      },

      deleteChat: (chatId: string) => {
        set(state => {
          const newChats = state.chats.filter(c => c.id !== chatId);
          return {
            chats: newChats,
            activeChatId: state.activeChatId === chatId 
              ? (newChats[0]?.id ?? null) 
              : state.activeChatId,
          };
        });
      },

      updateChatTitle: (chatId: string, title: string) => {
        set(state => ({
          chats: state.chats.map(chat =>
            chat.id === chatId
              ? { ...chat, title: title.slice(0, 40), updatedAt: Date.now() }
              : chat
          ),
        }));
      },

      addMessage: (chatId: string, message: Message) => {
        set(state => ({
          chats: state.chats.map(chat =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, message],
                  updatedAt: Date.now(),
                }
              : chat
          ),
        }));
      },

      updateMessage: (chatId: string, messageId: number, content: string) => {
        set(state => ({
          chats: state.chats.map(chat =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map(msg =>
                    msg.id === messageId ? { ...msg, content } : msg
                  ),
                  updatedAt: Date.now(),
                }
              : chat
          ),
        }));
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),

      searchChats: (query: string) => {
        const { chats } = get();
        if (!query.trim()) return chats;
        const lower = query.toLowerCase();
        return chats.filter(
          chat =>
            chat.title.toLowerCase().includes(lower) ||
            chat.messages.some(m => m.content.toLowerCase().includes(lower))
        );
      },
    }),
    {
      name: 'gigachat-storage',
      partialize: (state) => ({
        chats: state.chats,
        activeChatId: state.activeChatId,
      }),
    }
  )
);
