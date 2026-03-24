import { useEffect, useRef } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import type { Message as MessageType } from '../../types/message';
import './MessageList.css';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
