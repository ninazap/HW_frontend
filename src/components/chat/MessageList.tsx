import Message from './Message';
import './MessageList.css';

const mockMessages = [
  { id: 1, text: 'Привет! Как дела?', variant: 'user' },
  { id: 2, text: 'Здравствуйте! **Отлично**, спасибо!', variant: 'assistant' },
  { id: 3, text: 'Поможешь с кодом?', variant: 'user' },
  { id: 4, text: 'Конечно! *Что нужно сделать?*', variant: 'assistant' },
  { id: 5, text: 'Нужен React компонент', variant: 'user' },
  { id: 6, text: 'Без проблем!\n\n```\nconst App = () => <div>Hello</div>\n```', variant: 'assistant' },
];

const MessageList: React.FC = () => {
  return (
    <div className="message-list">
      {mockMessages.map((msg) => (
        <Message key={msg.id} text={msg.text} variant={msg.variant as 'user' | 'assistant'} />
      ))}
    </div>
  );
};

export default MessageList;
