import { useState } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import TypingIndicator from './TypingIndicator';
import type { Message } from '../../types/message';
import './ChatWindow.css';

interface ChatWindowProps {
  onOpenSettings: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onOpenSettings }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', content: 'Привет! Я GigaChat. Чем помочь?', timestamp: new Date() }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (text: string) => {
    const newUserMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    setTimeout(() => {
      const newAiMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Это моковый ответ на: ' + text,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newAiMsg]);
      setIsLoading(false);
    }, 1500);
  };

  const handleStop = () => {
    setIsLoading(false);
    console.log('Генерация остановлена');
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Проект React</h3>
        <button onClick={onOpenSettings}>⚙</button>
      </div>
      <MessageList messages={messages} isLoading={isLoading} />
      <InputArea onSend={handleSend} onStop={handleStop} disabled={isLoading} />
    </div>
  );
};

export default ChatWindow;
