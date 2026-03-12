import MessageList from './MessageList';
import InputArea from './InputArea';
import TypingIndicator from './TypingIndicator';
import './ChatWindow.css';

interface ChatWindowProps {
  onOpenSettings: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onOpenSettings }) => {
  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Проект React</h3>
        <button onClick={onOpenSettings}>⚙</button>
      </div>
      <MessageList />
      <TypingIndicator isVisible={true} />
      <InputArea />
    </div>
  );
};

export default ChatWindow;