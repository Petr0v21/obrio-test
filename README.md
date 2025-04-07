# Obrio Test Project

Тестовое задание для Obrio. Бэкенд-приложение использует PostgreSQL и Redis, разворачивается в Docker с помощью `docker-compose`.

## 🛠️ Стек технологий

- Node.js / TypeScript
- Prisma ORM
- PostgreSQL (15)
- Redis
- Docker + Docker Compose

## ⚙️ Переменные окружения

Создайте файл `.env` в корне проекта со следующим содержимым: как в example.env

> ❗️ Некоторые переменные (`DATABASE_URL`, `REDIS_HOST`) уже передаются через `docker-compose.yml`

## 🚀 Бысткий старт

Убедитесь, что у вас установлены:

- [Docker](https://www.docker.com/) (Моя версия Docker version 24.0.5, build ced0996)
- [Docker Compose](https://docs.docker.com/compose/) (Моя версия docker-compose version 1.29.2, build 5becea4c)

Затем выполните:

```bash
docker compose up --build
```

Или по шагам

```bash
docker compose build --no-cache

docker compose up
```

📦 Эндпоинты
POST /files/upload-links
Метод принимает JSON с полями:

[links]: массив ссылок на файлы (обязательный)

[isSync]: булево значение (опционально)

    true — загрузка файлов синхронно

    false (по умолчанию) — загрузка через очередь

GET /files
Метод возвращает список загруженных файлов.

Query параметры:

[page] — номер страницы (опционально, по умолчанию 1)

[take] — количество файлов на странице (опционально, по умолчанию 20)
