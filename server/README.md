# Chat Application Backend

A NestJS-based backend server for the real-time chat application providing REST APIs and WebSocket functionality.

## Tech Stack

- NestJS
- MongoDB (with Mongoose)
- Socket.IO
- JWT Authentication
- File Upload Support

## Project Structure

```
src/
├── auth/           # Authentication module
├── chat/           # Chat functionality
├── message/        # Message handling
├── user/           # User management
├── socket/         # WebSocket implementation
├── config/         # Configuration files
└── database/       # Database schemas and configuration
```

## API Documentation

### Authentication

#### Register User

```http
POST /auth/register
```

Request body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login

```http
POST /auth/login
```

Request body:

```json
{
  "email": "string",
  "password": "string"
}
```

Response:

```json
{
  "access_token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

### User Management

#### Get User Profile

```http
GET /user/profile
```

Headers:

```
Authorization: Bearer <token>
```

#### Update Profile

```http
PATCH /user/profile
```

Headers:

```
Authorization: Bearer <token>
```

Request body:

```json
{
  "username": "string",
  "avatar": "file"
}
```

### Chat

#### Get User Conversations

```http
GET /chat/conversations
```

Headers:

```
Authorization: Bearer <token>
```

#### Create New Chat

```http
POST /chat/create
```

Headers:

```
Authorization: Bearer <token>
```

Request body:

```json
{
  "participants": ["userId1", "userId2"],
  "type": "individual|group"
}
```

### Messages

#### Send Message

```http
POST /message/send
```

Headers:

```
Authorization: Bearer <token>
```

Request body:

```json
{
  "chatId": "string",
  "content": "string",
  "type": "text|file|image"
}
```

#### Get Chat Messages

```http
GET /message/:chatId
```

Headers:

```
Authorization: Bearer <token>
```

Query parameters:

- `limit`: number (default: 50)
- `page`: number (default: 1)

## WebSocket Events

### Connection

```typescript
socket.on('connect', () => {
  // Authenticate with JWT token
  socket.emit('authenticate', { token: 'JWT_TOKEN' });
});
```

### Events

- `message:new`: New message received
- `message:read`: Message read status updated
- `user:online`: User came online
- `user:offline`: User went offline
- `typing:start`: User started typing
- `typing:stop`: User stopped typing

## File Upload

The server supports file uploads for:

- User avatars (`/public/images/`)
- Chat attachments (`/public/attachments/`)

Supported file types:

- Images: .jpg, .jpeg, .png
- Documents: .pdf
- Videos: .mkv

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/chat-app

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

# File Upload
MAX_FILE_SIZE=10485760 # 10MB
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Start the development server:

```bash
npm run start:dev
```

4. Run in production:

```bash
npm run build
npm run start:prod
```

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Docker

Build the image:

```bash
docker build -t chat-app-server .
```

Run the container:

```bash
docker run -p 3000:3000 chat-app-server
```
