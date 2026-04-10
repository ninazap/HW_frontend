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
npm test```
Режим наблюдения (watch)
```bash
npm test -- --watch```
Покрытие тестами
Компонент / модуль	Описание
storage.ts	Работа с localStorage (set/get/remove)
chatStore.ts	Zustand store: создание, удаление, переименование чатов, отправка сообщений
Sidebar.tsx	Боковая панель: поиск, фильтрация, создание нового чата
InputArea.tsx	Поле ввода: отправка по клику / Enter, блокировка при загрузке, кнопка "Стоп"
Message.tsx	Отображение отдельного сообщения

Используемые технологии
React 18

TypeScript

Zustand (управление состоянием)

Vitest + Testing Library

CSS Modules

Автор
Frontend Team
