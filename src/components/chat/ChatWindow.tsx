import MessageList from './MessageList';
import InputArea from './InputArea';
import TypingIndicator from './TypingIndicator';
import type { Message } from '../../types/message';
import './ChatWindow.css';

interface ChatWindowProps {
  chatId: string;
  title: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onStop: () => void;
  onOpenSettings: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chatId,
  title,
  messages,
  isLoading,
  error,
  onSend,
  onStop,
  onOpenSettings,
}) => {
  return (
    // ✅ КЛЮЧ для перерисовки при смене чата
    <div className="chat-window" key={chatId}>
      <div className="chat-header">
        <h3 title={title}>{title}</h3>
        <button onClick={onOpenSettings}>⚙</button>
      </div>
      
      {error && <div className="chat-error">⚠️ {error}</div>}
      
      <MessageList messages={messages} isLoading={isLoading} />
      <InputArea onSend={onSend} onStop={onStop} disabled={isLoading} />
    </div>
  );
};

export default ChatWindow;
