# Quizly

Quizly is a modern, full-stack quiz platform built with Nuxt 3, Supabase, and Pinia. It allows users to create, manage, and participate in quizzes with real-time analytics and AI-powered features.

## Features

- **Quiz Creation & Management**: Create quizzes with multiple question types (MCQ, True/False, Open-Ended).
- **User Authentication**: Secure login and session management using Supabase.
- **Participant Tracking**: Track quiz participants, their scores, and time spent.
- **Real-Time Analytics**: Visualize quiz analytics with ECharts.
- **AI Integration**: Leverage AI for document processing and quiz generation (via OpenAI and Unstructured APIs).
- **Responsive UI**: Built with Vue 3 and Nuxt 3 for a seamless user experience.
- **Admin Dashboard**: Manage quizzes, participants, and view analytics.

## Tech Stack

- **Frontend**: Nuxt 3, Vue 3, Pinia, SCSS
- **Backend**: Supabase (Database, Auth, Storage)
- **AI/ML**: OpenAI, LangChain, Unstructured
- **Visualization**: ECharts

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd quizly
   ```
2. Install dependencies:
   ```sh
   pnpm install
   # or
   npm install
   ```
3. Configure environment variables:

   - Copy `.env.example` to `.env` and fill in your Supabase and API keys.

4. Run the development server:

   ```sh
   pnpm dev
   # or
   npm run dev
   ```

5. Access the app at `http://localhost:3000`

### Build for Production

```sh
pnpm build
pnpm preview
```

## Project Structure

- `components/` — Vue components (UI, quiz, admin, etc.)
- `composables/` — Pinia stores and composable logic
- `layouts/` — Nuxt layouts
- `middleware/` — Route guards and middleware
- `pages/` — Nuxt pages (routing)
- `public/` — Static assets
- `server/` — API routes and server logic
- `supabase/` — Supabase Edge Functions and config
- `assets/style/` — SCSS styles
- `utils/` — Utility functions

## Supabase Setup

- Create a Supabase project and configure tables for quizzes, questions, answers, participants, and scores.
- Set up storage buckets (e.g., `notes`) for file uploads.
- Configure Edge Functions in the `supabase/functions/` directory.

## AI & Document Processing

- Integrates with OpenAI and Unstructured for AI-powered quiz generation and document parsing.
- Configure API keys in your environment variables.

## Scripts

- `pnpm dev` — Start development server
- `pnpm build` — Build for production
- `pnpm generate` — Generate static site
- `pnpm preview` — Preview production build

## License

MIT

---

**Quizly** — Effortless quiz creation, analytics, and AI-powered features.
