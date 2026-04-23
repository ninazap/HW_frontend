import { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { useChatStore } from '../../store/chatStore';
import { getAccessToken, getModels } from '../../api/gigachat';
import Sidebar from '../sidebar/Sidebar';
import ChatWindow from '../chat/ChatWindow';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { useChatSync } from '../../hooks/useChatSync';
import { useChatStream } from '../../hooks/useChatStream';
import './AppLayout.css';

const SettingsPanel = lazy(() => import('../settings/SettingsPanel'));

const AppLayout: React.FC = () => {
  const { chatIdFromUrl } = useChatSync();
  
  const {
    chats,
    isLoading,
    error,
    createChat,
    deleteChat,
    updateChatTitle,
    searchChats,
    settings,
    setAvailableModels,
    selectChat,
    theme,
    setTheme,
  } = useChatStore();

  const activeChat = chats.find(c => c.id === chatIdFromUrl);
  const { handleSend, handleStop } = useChatStream(
    chatIdFromUrl ?? null,
    activeChat?.messages || [],
    settings
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Применяем тему из стора к DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Загрузка моделей при старте
  useEffect(() => {
    getAccessToken()
      .then(token => getModels(token))
      .then(models => {
        if (models.length > 0) setAvailableModels(models);
      })
      .catch(console.error);
  }, [setAvailableModels]);

  const filteredChats = useMemo(() => {
    return searchQuery ? searchChats(searchQuery) : chats;
  }, [searchQuery, chats, searchChats]);

  return (
    <div className="app-layout">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chats={filteredChats}
        activeChatId={chatIdFromUrl ?? null}
        onCreateChat={() => {
          createChat(); // ✅ Стор сам установит activeChatId -> хук синхронизирует URL
        }}
        onSelectChat={(id) => {
          selectChat(id);
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
          <ErrorBoundary>
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
          </ErrorBoundary>
        ) : (
          <div className="empty-chat">
            <div className="empty-icon">💬</div>
            <p>Выберите или создайте чат</p>
            <button className="create-chat-btn" onClick={() => createChat()}>+ Создать чат</button>
          </div>
        )}
      </main>
      
      <Suspense fallback={null}>
        <SettingsPanel 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          theme={theme}
          setTheme={setTheme}
        />
      </Suspense>
    </div>
  );
};

export default AppLayout;
