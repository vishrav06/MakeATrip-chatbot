 # MakeATrip Travel Chatbot

  A smart travel assistant chatbot that helps users with travel-related queries.

  ## Features

  - AI-powered travel recommendations and information
  - Maintains conversation history (last 10 messages)
  - Enforces travel-only conversations
  - Session-based chat management
  - Built with Node.js and Express

  ## Prerequisites

  - Node.js (v14 or higher)
  - OpenAI API key

  ## Installation

  1. Clone the repository
  ```bash
  git clone <your-repo-url>
  cd MakeATrip-chatbot

  2. Install dependencies
  npm install

  3. Create a .env file in the root directory
  OPENAI_API_KEY=your-openai-api-key
  PORT=3000
  NODE_ENV=development

  Running the Application

  Development mode:
  npm run dev

  Production mode:
  npm start

  The server will start on http://localhost:3000

  API Endpoints

  Health Check

  GET /api/health

  Send Message

  POST /api/chat/message
  Body:
  {
    "sessionId": "optional-session-id",
    "message": "What are the best places to visit in Paris?"
  }

  Get Conversation History

  GET /api/chat/history/:sessionId

  Delete Session

  DELETE /api/chat/session/:sessionId

  Usage Example

  1. Start a new conversation:
  POST http://localhost:3000/api/chat/message
  {
    "message": "Tell me about beaches in Bali"
  }

  2. Continue the conversation using the returned sessionId:
  POST http://localhost:3000/api/chat/message
  {
    "sessionId": "your-session-id",
    "message": "What about hotels?"
  }

  Non-Travel Query Handling

  - First non-travel query: Warning message
  - Second non-travel query: Conversation closed
  - Users must start a new session to continue
