# AI Recipe Extractor 🍳

AI Recipe Extractor is a full-stack Next.js application that leverages artificial intelligence to extract comprehensive recipes, ingredient lists, and instructions directly from YouTube video links. 

By utilizing Google's Gemini AI and YouTube transcripts, it automatically converts long-form cooking videos or shorts into easy-to-read, structured recipe formats.

## ✨ Features

- **YouTube Link Processing**: Simply paste a YouTube video URL (both standard videos and Shorts are supported).
- **AI-Powered Extraction**: Uses Google GenAI to intelligently parse the video transcript and extract accurate ingredients and step-by-step instructions.
- **User Authentication**: Secure login and user management handled via NextAuth.
- **Recipe Management**: Save, manage, and view your extracted recipes with a persistent MongoDB database.
- **Modern UI**: Built with Next.js 16, React 19, and Lucide React icons for a clean, responsive, and beautiful user experience.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Frontend**: [React](https://react.dev/), TypeScript
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai)
- **Transcript Parsing**: [youtube-transcript](https://www.npmjs.com/package/youtube-transcript)
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- A MongoDB Database URI
- Google Gemini API Key
- NextAuth Secret

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd ai-recipe-extractor
   ```

2. Install dependencies:
   ```bash
   npm install
   # or yarn install / pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and ensure you have the following variables configured (you can use your existing `.env.local` if it's already set up):
   ```env
   # MongoDB Connection
   MONGODB_URI=your_mongodb_connection_string

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret

   # AI API Key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or yarn dev / pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛣️ Roadmap

- [x] Basic YouTube transcript fetching
- [x] AI Recipe extraction via Google GenAI
- [x] User authentication (NextAuth)
- [x] Recipe saving and management (MongoDB)
- [ ] Instagram video caption extraction integration
- [ ] Quick-commerce platform integration for automated grocery cart generation

## 📄 License

This project is open-source.
