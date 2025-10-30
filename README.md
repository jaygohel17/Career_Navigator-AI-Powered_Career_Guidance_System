# Career Navigator

An AI-powered career guidance platform that helps users discover their ideal career path through aptitude tests, IQ assessments, and personalized AI recommendations.

## Features

- **User Authentication** - Secure sign up and login
- **Aptitude Testing** - Career-specific aptitude assessments
- **IQ Testing** - Cognitive ability evaluation
- **AI Recommendations** - Personalized career suggestions powered by Google Gemini AI
- **Progress Tracking** - Monitor your test history and results
- **User Dashboard** - Comprehensive profile management

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn-ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: Google Gemini API
- **Deployment**: Edge Functions on Supabase

## Setup

### Prerequisites

- Node.js and npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Supabase account ([sign up](https://supabase.com))
- Google Gemini API key ([get one](https://makersuite.google.com/app/apikey))

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd career-navigator

# Install dependencies
npm install

# Configure environment variables
# Copy .env and update with your Supabase credentials
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
# GEMINI_API_KEY=your_gemini_key

# Start development server
npm run dev
```
## Local Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Building for Production

```bash
npm run build
```

## Supabase Setup

1. Create a new Supabase project
2. Run migrations: `supabase db push`
3. Deploy Edge Functions: `supabase functions deploy`
4. Set secrets: `supabase secrets set GEMINI_API_KEY=your_key`
