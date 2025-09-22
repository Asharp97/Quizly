# Quizly

Quizly is a modern, full-stack quiz platform built with Nuxt 3, Pinia, and a custom GraphQL backend. It allows users to create, manage, and participate in quizzes with real-time analytics and AI-powered features.

## Features

- **Quiz Creation & Management**: Create quizzes with multiple question types (MCQ, True/False, Open-Ended).
- **User Authentication**: Secure login and session management.
- **Participant Tracking**: Track quiz participants, their scores, and time spent.
- **Real-Time Analytics**: Visualize quiz analytics with ECharts.
- **AI Integration**: Leverage AI for document processing and quiz generation (via OpenAI and Unstructured APIs).
- **Responsive UI**: Built with Vue 3 and Nuxt 3 for a seamless user experience.
- **Admin Dashboard**: Manage quizzes, participants, and view analytics.

## Tech Stack

- **Frontend**: Nuxt 3, Vue 3, Pinia, SCSS
- **Backend**: NestJS, GraphQL, Prisma ORM, PostgreSQL
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

   - Copy `.env.example` to `.env` and fill in your API keys.

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
- `assets/style/` — SCSS styles
- `utils/` — Utility functions

## Backend Overview

Quizly's backend is built with NestJS, Prisma, GraphQL, and PostgreSQL.

- **NestJS**: Modular architecture for maintainable code.
- **GraphQL API**: Flexible queries and mutations for quizzes, questions, answers, and users.
- **Prisma ORM**: Type-safe database access for PostgreSQL.
- **Authentication**: JWT-based auth with Redis session management.
- **Google OAuth**: Login/signup via Google.
- **Seeding**: Populate the database with sample users, quizzes, questions, and answers.
- **Environment Config**: Easily configurable via `.env`.

### Backend Setup

1. Clone the backend repo and install dependencies:
   ```sh
   pnpm install
   ```
2. Configure your `.env` file with database and API credentials.
3. Generate Prisma client and push schema:
   ```sh
   pnpm run gen
   pnpm run push
   ```
4. Seed the database:
   ```sh
   pnpm run seed
   ```
5. Run the server:
   ```sh
   pnpm run dev
   ```

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
