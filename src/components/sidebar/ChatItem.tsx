import { useState, memo } from 'react';
import type { Chat } from '../../store/chatStore';
import './ChatItem.css';

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isActive,
  onSelect,
  onDelete,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title);

  const handleRename = () => {
    if (editTitle.trim()) {
      onRename(editTitle.trim());
    }
    setIsEditing(false);
  };

  const lastMessage = chat.messages[chat.messages.length - 1];
  const preview = lastMessage?.content.slice(0, 30) + (lastMessage?.content.length > 30 ? '...' : '');

  return (
    <div
      className={`chat-item ${isActive ? 'active' : ''}`}
      onClick={onSelect}
    >
      {isEditing ? (
        <input
          className="chat-title-input"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => e.key === 'Enter' && handleRename()}
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <>
          <div className="chat-info">
            <span className="chat-title" title={chat.title}>
              {chat.title}
            </span>
            {preview && <span className="chat-preview">{preview}</span>}
            <span className="chat-date">
              {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="chat-actions">
            <button
              className="edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              ✎
            </button>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              🗑
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(ChatItem);
