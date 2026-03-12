import ChatItem from './ChatItem';
import './ChatList.css';

const mockChats = [
  { id: 1, title: 'Проект React', lastMessage: 'Отлично!', date: '10:30' },
  { id: 2, title: 'API интеграция', lastMessage: 'Жду ответ...', date: '09:15' },
  { id: 3, title: 'База данных', lastMessage: 'Готово', date: 'Вчера' },
  { id: 4, title: 'Тестирование', lastMessage: 'Нужно проверить', date: 'Вчера' },
  { id: 5, title: 'Документация', lastMessage: 'Обновил', date: 'Пн' },
];

const ChatList: React.FC = () => {
  return (
    <div className="chat-list">
      {mockChats.map((chat) => (
        <ChatItem key={chat.id} chat={chat} isActive={chat.id === 1} />
      ))}
    </div>
  );
};

export default ChatList;
