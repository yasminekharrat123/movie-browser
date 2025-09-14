# Movie Browser

A modern React application for browsing and searching movies using The Movie Database (TMDB) API. Built with TypeScript, Vite, and Material-UI with a responsive design and smooth animations.

## Overview

Movie Browser is a single-page application that allows users to discover popular movies, search for specific titles, and view detailed information about each movie including cast, crew, and trailers. The app features infinite scrolling, responsive design, and an elegant dark theme with animated backgrounds.

## Features

### Core Features
- **Movie Discovery**: Browse popular movies with infinite scroll pagination
- **Search Functionality**: Real-time search with debounced input (300ms delay)
- **Movie Details**: Comprehensive movie information including:
  - Cast and crew information
  - Movie trailers and videos
  - Production details and metadata
  - Ratings and release information
- **Responsive Design**: Mobile-first approach with collapsible sidebar
- **Dark Theme**: dark theme with custom styling

### UI/UX Features
- **Animated Background**: Custom wavy background using Simplex noise
- **Smooth Animations**: Framer Motion animations throughout the interface
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages
- **Infinite Scrolling**: Seamless pagination for movie lists
- **LRU Caching**: Client-side caching for movie details (max 100 items)

### Technical Features
- **TypeScript**: Full type safety with comprehensive type definitions
- **React Query**: Advanced data fetching with caching and background updates
- **Axios**: HTTP client with base service abstraction
- **Path Aliases**: Clean imports using `@/` prefix
- **Environment Variables**: API key management

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI Library**: Material-UI (MUI), Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Package Manager**: npm

## Development Tools

### Code Quality
- **ESLint**: Comprehensive linting with multiple plugins:
  - TypeScript ESLint
  - React and React Hooks
  - Tailwind CSS
  - Prettier integration
- **Prettier**: Code formatting with consistent style
- **TypeScript**: Static type checking and IntelliSense

### Testing
- **Jest**: Testing framework with TypeScript support
- **React Testing Library**: Component testing utilities
- **JSDOM**: Browser environment simulation
- **Test Coverage**: Unit tests for hooks and components

### Configuration Files
- `.eslintrc.json`: ESLint configuration with React and TypeScript rules
- `.prettierrc`: Prettier formatting rules
- `jest.config.js`: Jest testing configuration
- `tsconfig.json`: TypeScript compiler options
- `tailwind.config.ts`: Tailwind CSS customization
- `vite.config.ts`: Vite build configuration

## Scripts

```bash
### Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier

# Testing
npm test             # Run Jest tests
```

## CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on every push to the master branch:

### Pipeline Stages
1. **Lint & Format**: 
   - Code formatting with Prettier
   - Linting with ESLint (auto-fix enabled)
2. **Test**:
   - Unit test execution with Jest
   - Runs after successful linting

### CI Configuration
- **Node.js**: Version 20
- **OS**: Ubuntu Latest
- **Environment**: CI=true for test optimization

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with your TMDB API key:
   ```
   VITE_TMDB_API_KEY=your_api_key_here
   ```
4. Start development server: `npm run dev`

## Project Structure

```
src/
├── api/           # API services and HTTP client
├── components/    # React components
│   ├── ui/        # Reusable UI components
│   └── __tests__/ # Component tests
├── containers/    # Page-level components
├── hooks/         # Custom React hooks
│   └── __tests__/ # Hook tests
├── lib/           # Utility functions
└── types/         # TypeScript type definitions
```

## API Integration

The application integrates with The Movie Database (TMDB) API v3:
- Popular movies endpoint
- Movie search endpoint  
- Movie details with credits and videos
- Poster and backdrop image URLs

## License

Private project - All rights reserved.