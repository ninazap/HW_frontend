import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import './Message.css';

interface MessageProps {
  text: string;
  variant: 'user' | 'assistant';
}

const Message: React.FC<MessageProps> = ({ text, variant }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <button className="copy-btn" onClick={handleCopy}>
        {copied ? '✓' : '📋'}
      </button>
    </div>
  );
};

export default Message;