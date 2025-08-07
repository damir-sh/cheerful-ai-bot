# Cheerful AI Bot

A chatbot application that cheers up users and can recall information about previous conversations. Built as a tech challenge using Next.js, tRPC, and OpenRouter.

## Features

- 🤖 AI-powered chatbot that provides cheerful responses
- 💾 Conversation memory - the bot can recall information about users from previous chats
- 🎨 Clean UI built with Material-UI (MUI)
- 🔄 Real-time chat interface

## Tech Stack

- **Framework**: Next.js 15
- **API**: tRPC for type-safe APIs
- **Database**: SQLite + Prisma ORM
- **AI**: OpenRouter API
- **Styling**: Material-UI (MUI)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (version specified in package.json)
- A database (SQLite)
- OpenRouter API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/damir-sh/cheerful-ai-bot.git
   ```
2. Navigate to the project directory:
   ```bash
   cd cheerful-ai-bot
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the root directory and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   DATABASE_URL=file:./dev.db
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and go to `http://localhost:3000` to interact with the chatbot.
