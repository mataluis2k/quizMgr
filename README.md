# Quiz Management Tool

A React-based quiz building and management application that allows users to create, customize, and preview quizzes. Built with React, TypeScript, TailwindCSS, and Supabase for backend services.

## Features

- User authentication
- Create and manage quizzes
- Add multiple-choice and user input questions
- Drag-and-drop question reordering
- Customizable quiz styling
- Real-time quiz preview
- Responsive design

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Supabase account for backend services

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd quizMgr
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the migration script located in `supabase/migrations/` to set up the database schema
   - Configure authentication in your Supabase dashboard

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Linting

Check code quality:
```bash
npm run lint
```

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components for routing
- `src/services/` - Service modules for API and authentication
- `src/types/` - TypeScript type definitions
- `src/lib/` - Library configurations (Supabase client)
- `src/utils/` - Utility functions
- `supabase/migrations/` - Database migration scripts

## Technologies

- React 18
- TypeScript
- Vite
- TailwindCSS
- Supabase (Authentication, Database)
- React Router
- React Beautiful DnD (Drag and Drop)
- Lucide React (Icons)
