# Frontend Project GIGACHAT

React-приложение с GIGACHAT на TypeScript.

## Установка и запуск

```bash
npm install
npm run dev
```
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

Используемые технологии
React 18

TypeScript

Zustand (управление состоянием)

Vitest + Testing Library

CSS Modules


# GigaChat Web Interface
Современный веб-интерфейс для работы с нейросетью GigaChat. Приложение оптимизировано, покрыто тестами и готово к деплою.

## Демо
🔗 [Посмотреть приложение на Vercel](TODO)

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

## Структура проекта
src/
├── api/              # Клиент для GigaChat API
├── components/       # UI-компоненты (Chat, Layout, Sidebar, Settings)
├── common/           # Общие компоненты (ErrorBoundary)
├── store/            # Zustand store + тесты логики
├── types/            # TypeScript типы
├── utils/            # Утилиты (storage)
├── styles/           # Глобальные темы
└── tests/            # Настройки Vitest