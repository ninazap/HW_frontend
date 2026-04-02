import { useEffect, useRef } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import type { Message as MessageType } from '../../types/message';
import './MessageList.css';

interface MessageListProps {
  messages?: MessageType[];
  isLoading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages = [], isLoading = false }) => {
  const endRef = useRef<HTMLDivElement>(null);

  // ✅ Скролл к началу при смене чата (messages изменились кардинально)
  useEffect(() => {
    if (messages.length === 0 && endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages.length]);

  // ✅ Автоскролл к последнему сообщению
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="message-list-empty">
        <div className="empty-icon">💬</div>
        <p>Начните диалог</p>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((msg) => (
        <Message key={msg.id} text={msg.content} variant={msg.role} />
      ))}
      <TypingIndicator isVisible={isLoading} />
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;
