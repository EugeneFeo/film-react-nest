# FILM!

## Установка

### MongoDB

Установите MongoDB, скачав дистрибутив с официального сайта или с помощью пакетного менеджера вашей ОС.

Установите MongoDB Database Tools.

Запустите MongoDB и выполните из корневой папки проекта:

```bash
mongoimport --uri="mongodb://127.0.0.1:27017/afisha" --collection=films --file=backend/test/mongodb_initial_stub.json --jsonArray
```

### Бэкенд

Перейдите в папку с исходным кодом бэкенда:

```bash
cd backend
```

Установите зависимости:

```bash
npm ci
```

Создайте файл `.env` из примера `.env.example`:

```bash
cp .env.example .env
```

Параметры окружения:

- `DATABASE_DRIVER` — тип драйвера СУБД (`mongodb`).
- `DATABASE_URL` — адрес MongoDB (`mongodb://127.0.0.1:27017/afisha`).
- `PORT` — порт сервера (`3000`).
- `DEBUG` — настройки отладки.

MongoDB должна быть установлена и запущена.

Запустите бэкенд:

```bash
npm run start:dev
```

Для проверки отправьте тестовый запрос:

```bash
curl http://localhost:3000/api/afisha/films
```

### Проверка кода

```bash
npm run build
npm run lint
```

Для автоматического исправления ошибок ESLint:

```bash
npm run lint:fix
```
