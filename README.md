# GigaChat Web Interface
Современный веб-интерфейс для работы с нейросетью GigaChat.

## Демо
🔗 [Посмотреть приложение на Vercel](https://ninazap-hw-frontend.vercel.app/)

## Возможности
-  Интеграция с GigaChat API (REST + Streaming/SSE)
-  Управление чатами: создание, переименование, удаление, поиск
-  Сохранение истории в `localStorage` с восстановлением при перезагрузке
-  Переключение тёмной и светлой темы через CSS-переменные
-  Адаптивная вёрстка (320px – 1440px)
-  Error Boundaries и обработка ошибок API
-  Оптимизация: Code Splitting, React.memo, Lazy Loading

## Стек технологий
- **Frontend:** React 18, TypeScript, Vite
- **State Management:** Zustand + `persist` middleware
- **Routing:** React Router DOM v6
- **Styling:** CSS Variables, CSS Modules, адаптивные медиа-запросы
- **Testing:** Vitest, React Testing Library
- **API:** Sber GigaChat API (OAuth 2.0, SSE streaming)

## Запуск локально
1) Клонируйте репозиторий:
git clone https://github.com/ninazap/HW_frontend.git
cd HW_frontend
2) Установите зависимости:
npm install
3) Настройте переменные окружения.
4) Запустите сервер разработки:
npm run dev
Приложение откроется в браузере по адресу http://localhost:5173

## Переменные окружения
Для работы приложения необходимо создать файл .env в корне проекта и добавить следующие переменные:
- VITE_GIGACHAT_CLIENT_ID - Идентификатор клиента из личного кабинета Сбера
- VITE_GIGACHAT_CLIENT_SECRET - Секретный ключ клиента из личного кабинета Сбера
- 
## Тестирование
В проекте используются Vitest + React Testing Library.

Запуск тестов

```bash
npm test
```

Режим наблюдения (watch)

```bash
npm test --watch
```

### Покрытие тестами
Компоненты:
storage.ts		Работа с localStorage (set/get/remove)
chatStore.ts		Zustand store: создание, удаление, переименование чатов, отправка сообщений
Sidebar.tsx		Боковая панель: поиск, фильтрация, создание нового чата
InputArea.tsx		Поле ввода: отправка по клику / Enter, блокировка при загрузке, кнопка "Стоп"
Message.tsx		Отображение отдельного сообщения
