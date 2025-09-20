# Chat Application

A real-time chat application built with React (TypeScript) for the frontend and NestJS for the backend.

## Project Structure

```
├── client/          # Frontend React application
│   ├── src/
│   │   ├── api/     # API integration
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── socket/  # WebSocket integration
│   └── ...
└── server/          # Backend NestJS application
    ├── src/
    │   ├── auth/    # Authentication
    │   ├── chat/    # Chat functionality
    │   ├── user/    # User management
    │   └── socket/  # WebSocket server
    └── ...
```

## Features

- Real-time messaging
- User authentication
- Group chats
- File attachments
- Friend system
- User notifications
- Responsive design

## Technology Stack

### Frontend

- React with TypeScript
- Redux for state management
- Socket.io client
- Tailwind CSS
- Vite

### Backend

- NestJS
- Socket.io
- TypeScript
- File upload handling

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Docker (optional)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Khaledr001/chat-app.git
cd chat-app
```

2. Install dependencies:

For the client:

```bash
cd client
npm install
```

For the server:

```bash
cd server
npm install
```

3. Start the development servers:

For the client:

```bash
cd client
npm run dev
```

For the server:

```bash
cd server
npm run start:dev
```

### Docker Setup (Optional)

You can also run the application using Docker:

```bash
docker-compose up
```

## Environment Variables

Create `.env` files in both client and server directories with the necessary environment variables.
