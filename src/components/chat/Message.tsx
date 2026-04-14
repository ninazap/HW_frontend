import ReactMarkdown from 'react-markdown';
import { useState, memo } from 'react';
import './Message.css';

interface MessageProps {
  text: string;
  variant: 'user' | 'assistant';
}

const Message: React.FC<MessageProps> = ({ text, variant }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`message ${variant}`}>
      {variant === 'assistant' && (
        <div className="message-avatar">🤖</div>
      )}
      <div className="message-content">
        <div className="message-sender">{variant === 'user' ? 'Вы' : 'GigaChat'}</div>
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
      {variant === 'assistant' && (
        <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
          {copied ? '✓ Скопировано' : '📋'}
        </button>
      )}
    </div>
  );
};

export default memo(Message);
