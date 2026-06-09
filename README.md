# React + Vite Starter Template (Strong Junior+)

Индивидуальный инженерный шаблон для разработки масштабируемых Frontend-приложений. Настроен с учетом архитектурных стандартов и оптимизации рабочего процесса.

## 🚀 Стек технологий

- **React 19** (Modern Context & Hooks)
- **Vite** (Быстрая сборка и HMR)
- **CSS Modules** (Изоляция стилей)
- **Prettier** (Единый стандарт форматирования)

## 🏗 Архитектура и фичи

- **Path Aliases (`@`)**: Настроены через `vite.config.js` и `jsconfig.json`. Импорты идут от папки `src/`.
- **JSDoc Validation**: Включена проверка типов (`checkJs: true`). Пропсы компонентов документируются для IntelliSense.
- **Структура компонентов**: Каждая сущность живет в своей директории (`Component/index.js`).
- **Дизайн-система**: Глобальные CSS-переменные настроены в `src/index.css`.

## 📁 Структура проекта

- `src/api` — Логика запросов к API.
- `src/components` — UI-компоненты (Atomic Design ready).
- `src/hooks` — Кастомные React хуки.
- `src/styles` — Общие стили и темы.
- `src/utils` — Хелперы и форматирование данных.

## 🛠 Установка и запуск

1. Клонировать репозиторий:
   ```powershell
   git clone <url-репозитория>
   ```
2. Установить зависимости:

   ```powershell
   npm install
   ```

3. Отвязать репозиторий от шаблонного
   ```powershell
   Remove-Item -Recurse -Force .git
   ```

4.Запустить сервер разработки:

```powershell
npm install
```
