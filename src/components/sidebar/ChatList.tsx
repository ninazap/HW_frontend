import ChatItem from './ChatItem';
import type { Chat } from '../../store/chatStore';
import './ChatList.css';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  onSelect,
  onDelete,
  onRename,
}) => {
  if (chats.length === 0) {
    return <div className="chat-list-empty">Нет чатов</div>;
  }

  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === activeChatId}
          onSelect={() => onSelect(chat.id)}
          onDelete={() => onDelete(chat.id)}
          onRename={(title) => onRename(chat.id, title)}
        />
      ))}
    </div>
  );
};

export default ChatList;
