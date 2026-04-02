import { useState } from 'react';
import ChatList from './ChatList';
import SearchInput from './SearchInput';
import type { Chat } from '../../store/chatStore';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Chat[];
  activeChatId: string | null;
  onCreateChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  chats,
  activeChatId,
  onCreateChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onCreateChat}>➕ Новый чат</button>
        <button className="close-btn" onClick={onClose}>❌</button>
      </div>
      
      <SearchInput value={searchQuery} onChange={onSearchChange} />
      
      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        onSelect={onSelectChat}
        onDelete={onDeleteChat}
        onRename={onRenameChat}
      />
    </aside>
  );
};

export default Sidebar;
