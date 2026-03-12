import './ChatItem.css';

interface Chat {
  id: number;
  title: string;
  lastMessage: string;
  date: string;
}

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, isActive }) => {
  return (
    <div className={`chat-item ${isActive ? 'active' : ''}`}>
      <div className="chat-info">
        <span className="chat-title">{chat.title}</span>
        <span className="chat-date">{chat.date}</span>
      </div>
      <div className="chat-actions">
        <button className="edit-btn">✎</button>
        <button className="delete-btn">🗑</button>
      </div>
    </div>
  );
};

export default ChatItem;
