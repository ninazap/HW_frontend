import { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatStore } from '../../store/chatStore';
import { getAccessToken, getModels } from '../../api/gigachat'; // ✅ Импортируем getModels
import Sidebar from '../sidebar/Sidebar';
import ChatWindow from '../chat/ChatWindow';
import { ErrorBoundary } from '../common/ErrorBoundary';
import type { Message } from '../../types/message';
import './AppLayout.css';

const SettingsPanel = lazy(() => import('../settings/SettingsPanel'));

interface AppLayoutProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ theme, setTheme }) => {
  const { id: chatIdFromUrl } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    chats,
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
    settings,
    setAvailableModels, // ✅ Действие из стора
  } = useChatStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Загрузка моделей при старте приложения
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const token = await getAccessToken();
        const models = await getModels(token);
        if (models.length > 0) {
          setAvailableModels(models);
        }
      } catch (err) {
        console.error('Failed to fetch models:', err);
      }
    };
    fetchModels();
  }, [setAvailableModels]);

  useEffect(() => {
    if (chatIdFromUrl) {
      const chat = chats.find(c => c.id === chatIdFromUrl);
      if (chat && chat.id !== chatIdFromUrl) selectChat(chatIdFromUrl);
    }
  }, [chatIdFromUrl, chats, selectChat]);

  useEffect(() => {
    if (!chatIdFromUrl && chats.length === 0) {
      const newId = createChat();
      navigate(`/chat/${newId}`, { replace: true });
    }
  }, [chatIdFromUrl, chats.length, createChat, navigate]);

  const activeChat = chats.find(c => c.id === chatIdFromUrl);
  const filteredChats = useMemo(() => searchQuery ? searchChats(searchQuery) : chats, [searchQuery, chats, searchChats]);

  const handleSend = useCallback(async (text: string) => {
    if (!chatIdFromUrl) return;
    const newUserMsg: Message = { id: Date.now(), role: 'user', content: text, timestamp: new Date() };
    addMessage(chatIdFromUrl, newUserMsg);
    setLoading(true);
    setError(null);

    if (activeChat?.messages.length === 0 && activeChat?.title === 'Новый чат') {
      updateChatTitle(chatIdFromUrl, text.slice(0, 40) || 'Новый чат');
    }

    try {
      const { sendMessage } = await import('../../api/gigachat');
      const allMessages = [...(activeChat?.messages || []), newUserMsg];
      const gigachatMessages = allMessages.map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content }));

      const placeholderId = Date.now() + 1;
      addMessage(chatIdFromUrl, { id: placeholderId, role: 'assistant', content: '', timestamp: new Date() });

      let fullContent = '';
      await sendMessage(gigachatMessages, settings, (chunk) => {
        fullContent += chunk;
        updateMessage(chatIdFromUrl, placeholderId, fullContent);
      });

      if (!fullContent) {
        const response = await sendMessage(gigachatMessages, settings);
        updateMessage(chatIdFromUrl, placeholderId, response);
      }
    } catch (err) {
      console.error('Send error:', err);
      setError('Не удалось получить ответ.');
      addMessage(chatIdFromUrl, { id: Date.now() + 1, role: 'assistant', content: '⚠️ Ошибка.', timestamp: new Date() });
    } finally {
      setLoading(false);
    }
  }, [chatIdFromUrl, activeChat, addMessage, updateMessage, updateChatTitle, setLoading, setError, settings]);

  return (
    <div className="app-layout">
      <Sidebar 
        isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}
        chats={filteredChats} activeChatId={chatIdFromUrl ?? null}
        onCreateChat={() => { const newId = createChat(); navigate(`/chat/${newId}`); setIsSidebarOpen(false); }}
        onSelectChat={(id) => { navigate(`/chat/${id}`); setIsSidebarOpen(false); }}
        onDeleteChat={(id) => { if (confirm('Удалить чат?')) deleteChat(id); }}
        onRenameChat={(id, title) => updateChatTitle(id, title)}
        searchQuery={searchQuery} onSearchChange={setSearchQuery}
      />
      <main className="main-content">
        <button className="burger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>
        {activeChat ? (
          <ErrorBoundary>
            <ChatWindow key={activeChat.id} chatId={activeChat.id} title={activeChat.title}
              messages={activeChat.messages} isLoading={isLoading} error={error}
              onSend={handleSend} onStop={() => setLoading(false)} onOpenSettings={() => setIsSettingsOpen(true)}
            />
          </ErrorBoundary>
        ) : (
          <div className="empty-chat">
            <div className="empty-icon">💬</div>
            <p>Выберите или создайте чат</p>
            <button className="create-chat-btn" onClick={() => { const newId = createChat(); navigate(`/chat/${newId}`); }}>+ Создать чат</button>
          </div>
        )}
      </main>
      <Suspense fallback={null}>
        <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} theme={theme} setTheme={setTheme} />
      </Suspense>
    </div>
  );
};

export default AppLayout;
