# Overview

This is an Isometric Room Editor - a web-based 3D studio application for creating and designing room layouts using an isometric camera view. The application allows users to drag and drop furniture assets, arrange them in 3D space with snap-to-grid functionality, apply textures, generate scenes using AI prompts, and export their creations. Built as a React-based web application with Three.js for 3D rendering, it provides an intuitive interface for interior design and room layout creation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **3D Rendering**: Three.js with React Three Fiber for declarative 3D scene management
- **UI Components**: Radix UI primitives with shadcn/ui component library and Tailwind CSS for styling
- **State Management**: Zustand stores for managing scene objects, editor state, and asset library
- **Routing**: Single-page application without client-side routing

## Camera and 3D Scene
- **Camera Type**: OrthographicCamera configured for fixed isometric viewing angle
- **Controls**: OrbitControls with restricted rotation to maintain isometric perspective
- **Grid System**: Snap-to-grid functionality with 0.5 unit increments for precise object placement
- **Transform Tools**: Gizmos for moving, rotating, and scaling objects with undo/redo history

## Asset Management
- **Asset Loading**: GLTF/GLB 3D model support with fallback to simple geometry
- **Asset Categories**: Organized by furniture types (bed, table, lamp, rug, frames, plant, window, chair)
- **Texture System**: File upload support for custom textures with material assignment
- **Asset Library**: Searchable and filterable sidebar with drag-and-drop functionality

## Editor Features
- **Multi-tool Interface**: Select, move, rotate, scale, and delete tools with keyboard shortcuts
- **History System**: Undo/redo functionality for all object manipulations
- **Export System**: PNG export with resolution multiplier options and transparent background support
- **Keyboard Shortcuts**: Comprehensive shortcuts for tools (Q/W/E/R) and actions (Ctrl+Z/Y, Delete, G for grid)

## Backend Architecture
- **Server**: Express.js with TypeScript for API endpoints
- **File Handling**: Multer middleware for texture uploads with size and type validation
- **Development**: Vite middleware integration for hot module replacement in development
- **Static Serving**: Custom static file serving with production build support

## AI Integration
- **Scene Generation**: OpenAI API integration for text-to-scene generation
- **Prompt Processing**: Natural language processing to convert descriptions into 3D object placements
- **Asset Mapping**: Rules engine to match prompt keywords with available 3D assets
- **Placement Logic**: Intelligent object positioning based on interior design principles

# External Dependencies

## Database and ORM
- **Drizzle ORM**: PostgreSQL schema management with migration support
- **Neon Database**: Serverless PostgreSQL database connection via @neondatabase/serverless
- **Schema**: User management system with basic authentication structure

## 3D Graphics and Assets
- **Three.js Ecosystem**: @react-three/fiber, @react-three/drei, @react-three/postprocessing for comprehensive 3D functionality
- **GLSL Shaders**: Vite plugin support for custom shader materials
- **Asset Formats**: Support for GLTF, GLB, and common image formats (PNG, JPG)

## UI and Styling
- **Radix UI**: Complete set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Sonner**: Toast notification system for user feedback
- **Inter Font**: Typography via @fontsource/inter

## Development and Build Tools
- **TypeScript**: Full type safety across client and server
- **Vite**: Fast development server and optimized production builds
- **ESBuild**: Server-side bundling for production deployment
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

## API and External Services
- **OpenAI API**: GPT model integration for AI-powered scene generation
- **File Upload**: Local file system storage with plans for CDN integration
- **TanStack Query**: Server state management and API interaction
- **Environment Variables**: Secure configuration management for API keys and database URLs