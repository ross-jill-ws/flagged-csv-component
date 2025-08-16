# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application built with TypeScript and Vite. The project uses React 19 with a minimal Vite setup for fast development and hot module replacement (HMR).

## Commands

### Development
- `node22 npm run dev` - Start the Vite development server with HMR
- `node22 npm run build` - Build for production (runs TypeScript compiler and Vite build)
- `node22 npm run build:lib` - Build the library for npm publishing
- `node22 npm run preview` - Preview the production build locally
- `node22 npm run lint` - Run ESLint to check code quality

## Architecture

### Build System
- **Vite** as the build tool and dev server
- **TypeScript** for type safety with project references (tsconfig.app.json for app code, tsconfig.node.json for config files)
- **ESLint** configured with TypeScript and React hooks support

### Application Structure
- Entry point: `src/main.tsx` - Renders the React app in StrictMode
- Main component: `src/App.tsx` - Root application component with demo interface
- **FlaggedCsvComponent**: `src/components/FlaggedCsvComponent.tsx` - Main library component that renders flagged CSV data as an Excel-like table
- **CSV Parser**: `src/utils/flaggedCsvParser.ts` - Parses flagged CSV format with support for colors, merged cells, and location flags
- Library exports: `src/lib/index.ts` - Entry point for npm package distribution
- Styles: CSS modules with `App.css` and `index.css`
- Assets: Static files in `public/` and imported assets in `src/assets/`

### Key Dependencies
- React 19 with React DOM
- @vitejs/plugin-react for React Fast Refresh
- TypeScript with ESLint integration
- React Hooks and React Refresh ESLint plugins
- Whenever `npm` command is used, replace it with `node22 npm`. The default `npm` version in our OS is node18, which is old