import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatStore } from '../../store/chatStore';
import Sidebar from '../sidebar/Sidebar';
import ChatWindow from '../chat/ChatWindow';
import SettingsPanel from '../settings/SettingsPanel';
import type { Message } from '../../types/message';
import './AppLayout.css';

interface AppLayoutProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ theme, setTheme }) => {
  const { id: chatIdFromUrl } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    chats,
    activeChatId,
    isLoading,
    error,
    selectChat,
    createChat,
    deleteChat,
    updateChatTitle,
    addMessage,
    updateMessage,
    setLoading,
    setError,
    searchChats,
  } = useChatStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ ТОЛЬКО URL → Store (не наоборот!)
  useEffect(() => {
    if (chatIdFromUrl) {
      const chat = chats.find(c => c.id === chatIdFromUrl);
      if (chat && chat.id !== activeChatId) {
        selectChat(chatIdFromUrl);
      }
    }
  }, [chatIdFromUrl, chats, activeChatId, selectChat]);

  // ✅ Авто-создание чата если нет активных
  useEffect(() => {
    if (!chatIdFromUrl && chats.length === 0) {
      const newId = createChat();
      navigate(`/chat/${newId}`, { replace: true });
    }
  }, [chatIdFromUrl, chats.length, createChat, navigate]);

  // ✅ Находим активный чат по URL
  const activeChat = chats.find(c => c.id === chatIdFromUrl);

  const handleSend = useCallback(async (text: string) => {
    if (!chatIdFromUrl) return;
    
    const newUserMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    addMessage(chatIdFromUrl, newUserMsg);
    setLoading(true);
    setError(null);

    // Авто-генерация названия по первому сообщению
    if (activeChat?.messages.length === 0 && activeChat?.title === 'Новый чат') {
      const title = text.slice(0, 40) || 'Новый чат';
      updateChatTitle(chatIdFromUrl, title);
    }

    try {
      const { sendMessage } = await import('../../api/gigachat');
      
      // ✅ ОТПРАВЛЯЕМ ВСЮ ИСТОРИЮ ЧАТА (контекст диалога)
      const allMessages = [...(activeChat?.messages || []), newUserMsg];
      
      const gigachatMessages = allMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

      const placeholderId = Date.now() + 1;
      addMessage(chatIdFromUrl, {
        id: placeholderId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      });

      let fullContent = '';
      
      await sendMessage(gigachatMessages, (chunk) => {
        fullContent += chunk;
        updateMessage(chatIdFromUrl, placeholderId, fullContent);
      });

      if (!fullContent) {
        const response = await sendMessage(gigachatMessages);
        updateMessage(chatIdFromUrl, placeholderId, response);
      }

    } catch (err) {
      console.error('Send error:', err);
      setError('Не удалось получить ответ. Проверьте подключение.');
      addMessage(chatIdFromUrl, {
        id: Date.now() + 1,
        role: 'assistant',
        content: '⚠️ Ошибка при получении ответа. Попробуйте снова.',
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
    }
  }, [chatIdFromUrl, activeChat, addMessage, updateMessage, updateChatTitle, setLoading, setError]);

  const handleStop = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  const filteredChats = searchQuery ? searchChats(searchQuery) : chats;

  return (
    <div className="app-layout">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chats={filteredChats}
        activeChatId={chatIdFromUrl}
        onCreateChat={() => {
          const newId = createChat();
          navigate(`/chat/${newId}`);  // ✅ Только навигация, без selectChat
          setIsSidebarOpen(false);
        }}
        onSelectChat={(id) => {
          navigate(`/chat/${id}`);  // ✅ Только навигация, useEffect сам вызовет selectChat
          setIsSidebarOpen(false);
        }}
        onDeleteChat={(id) => {
          if (confirm('Удалить этот чат?')) {
            deleteChat(id);
          }
        }}
        onRenameChat={(id, title) => updateChatTitle(id, title)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="main-content">
        <button className="burger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>
        
        {activeChat ? (
          <ChatWindow
            key={activeChat.id}
            chatId={activeChat.id}
            title={activeChat.title}
            messages={activeChat.messages}
            isLoading={isLoading}
            error={error}
            onSend={handleSend}
            onStop={handleStop}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        ) : (
          <div className="empty-chat">
            <div className="empty-icon">💬</div>
            <p>Выберите или создайте чат</p>
            <button className="create-chat-btn" onClick={() => {
              const newId = createChat();
              navigate(`/chat/${newId}`);
            }}>+ Создать чат</button>
          </div>
        )}
      </main>
      
      <SettingsPanel 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
};

export default AppLayout;
