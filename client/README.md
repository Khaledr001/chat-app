# Chat Application Frontend

A React-based frontend for the real-time chat application built with TypeScript, Redux, and Socket.IO.

## Tech Stack

- React with TypeScript
- Redux Toolkit for state management
- Socket.IO client for real-time communication
- Tailwind CSS for styling
- Vite for build tooling

## Project Structure

```
src/
├── api/              # API integration modules
│   ├── api.ts        # Base API configuration
│   ├── auth.api.ts   # Authentication API
│   ├── chat.api.ts   # Chat related API
│   └── user.api.ts   # User management API
│
├── components/       # Reusable React components
│   ├── auth/        # Authentication components
│   ├── chat/        # Chat UI components
│   ├── chatLayout/  # Chat layout components
│   ├── groups/      # Group chat components
│   ├── loader/      # Loading components
│   └── modal/       # Modal components
│
├── pages/           # Main application pages
│   ├── Chat.tsx
│   ├── Group.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   └── Signup.tsx
│
├── redux/           # Redux state management
│   ├── store.ts
│   ├── api/
│   └── reducers/
│
└── socket/          # WebSocket integration
```

## Key Features

- Real-time chat messaging
- Group chat support
- File sharing
- User authentication
- Friend system
- Notifications
- Responsive design
- Infinite scroll chat history
- Online/offline status
- Typing indicators

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   Create a `.env` file in the root directory with:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=ws://localhost:3000
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Component Documentation

### Chat Components

#### ChatArea (`components/chatLayout/ChatArea.tsx`)

Main chat interface that displays messages and handles message interactions.

#### InputArea (`components/chat/inputArea.tsx`)

Message input component with support for text, files, and emojis.

#### LeftSidebar (`components/chatLayout/LeftSidebar.tsx`)

Displays chat list and user contacts.

#### RightSidebar (`components/chatLayout/RightSidebar.tsx`)

Shows chat details, shared media, and group members.

### Authentication Components

#### AuthLayout (`components/auth/AuthLayout.tsx`)

Layout wrapper for authentication pages.

### Hooks

- `useUsers` - Custom hook for user management
- `infiniteScrollToTop` - Hook for implementing infinite scroll

## State Management

The application uses Redux Toolkit for state management with the following main slices:

- `auth` - Authentication state
- `chat` - Chat messages and conversations
- `chatLayout` - UI layout state
- `misc` - Miscellaneous app state

## WebSocket Events

### Incoming Events

- `message:receive` - New message received
- `user:status` - User online/offline status update
- `typing:indicator` - Typing status from other users

### Outgoing Events

- `message:send` - Send new message
- `typing:start` - User started typing
- `typing:stop` - User stopped typing

## Docker

Build the image:

```bash
docker build -t chat-app-client .
```

Run the container:

```bash
docker run -p 5173:5173 chat-app-client
```

## Browser Support

The application is tested and supported on:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Build for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed.
