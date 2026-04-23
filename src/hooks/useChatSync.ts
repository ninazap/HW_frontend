import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';

export const useChatSync = () => {
  const { id: chatIdFromUrl } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { chats, activeChatId, selectChat, createChat } = useChatStore();
  
  // Флаг для разрыва цикла URL ↔ Store
  const isNavigating = useRef(false);

  // URL -> Store
  useEffect(() => {
    if (isNavigating.current) {
      isNavigating.current = false;
      return;
    }
    if (chatIdFromUrl && chatIdFromUrl !== activeChatId) {
      selectChat(chatIdFromUrl);
    }
  }, [chatIdFromUrl, selectChat]);

  // Store -> URL
  useEffect(() => {
    if (activeChatId && activeChatId !== chatIdFromUrl) {
      isNavigating.current = true;
      navigate(`/chat/${activeChatId}`, { replace: true });
    }
  }, [activeChatId, navigate]);

  // Авто-создание чата при пустом хранилище
  useEffect(() => {
    if (!chatIdFromUrl && chats.length === 0) {
      const newId = createChat();
      isNavigating.current = true;
      navigate(`/chat/${newId}`, { replace: true });
    }
  }, [chatIdFromUrl, chats.length, createChat, navigate]);

  return { chatIdFromUrl };
};
