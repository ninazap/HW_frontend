import { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { sendMessage } from '../api/gigachat';
import type { Message } from '../types/message';

/**
 * Хук для управления отправкой сообщений и стримингом
 * Инкапсулирует логику работы с GigaChat API
 */
export const useChatStream = (
  chatId: string | null,
  messages: Message[],
  settings: any // Можно типизировать строго, но пока оставим any для краткости
) => {
  const { addMessage, updateMessage, setLoading, setError } = useChatStore();

  const handleSend = useCallback(async (text: string) => {
    if (!chatId) return;

    // 1. Добавляем сообщение пользователя
    const newUserMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    addMessage(chatId, newUserMsg);
    setLoading(true);
    setError(null);

    // Подготовка контекста (все сообщения чата + новое)
    // Важно: берем messages из аргумента (текущее состояние), добавляем newUserMsg
    // Так как стейт еще не обновился в момент вызова
    const allMessages = [...messages, newUserMsg];
    
    const gigachatMessages = allMessages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));

    // 2. Создаем placeholder для ответа ассистента
    const placeholderId = Date.now() + 1;
    addMessage(chatId, {
      id: placeholderId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    });

    try {
      let fullContent = '';

      // 3. Запускаем стриминг
      await sendMessage(gigachatMessages, settings, (chunk) => {
        fullContent += chunk;
        // Обновляем контент в реальном времени
        updateMessage(chatId, placeholderId, fullContent);
      });

      // Если стриминг не сработал или вернулся пустой результат
      if (!fullContent) {
        const response = await sendMessage(gigachatMessages, settings);
        updateMessage(chatId, placeholderId, response);
      }

    } catch (err) {
      console.error('Stream error:', err);
      setError('Не удалось получить ответ. Проверьте подключение.');
      // Добавляем сообщение об ошибке в чат
      addMessage(chatId, {
        id: Date.now() + 1,
        role: 'assistant',
        content: '⚠️ Ошибка при получении ответа от GigaChat.',
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
    }
  }, [chatId, messages, settings, addMessage, updateMessage, setLoading, setError]);

  const handleStop = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  return { handleSend, handleStop };
};
