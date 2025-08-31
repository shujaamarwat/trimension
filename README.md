# Trimension

An **Isometric Room Editor** - a web-based 3D studio application for creating and designing room layouts using an isometric camera view. The application allows users to drag and drop furniture assets, arrange them in 3D space with snap-to-grid functionality, apply textures, generate scenes using AI prompts, and export their creations.

## Features

- **3D Room Design**: Create and arrange room layouts with an intuitive isometric perspective
- **Asset Library**: Drag & drop furniture models (beds, tables, lamps, rugs, frames, plants, windows, chairs)
- **Snap-to-Grid**: Precise object placement with 0.5 unit grid increments
- **Transform Tools**: Move, rotate, scale, and delete objects with undo/redo functionality
- **AI Scene Generation**: Use OpenAI API to generate room layouts from text descriptions
- **Texture System**: Upload and apply custom textures to objects
- **Export Options**: PNG export with resolution multiplier and transparent background support
- **Keyboard Shortcuts**: Comprehensive shortcuts for efficient workflow

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd trimension
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL=your_neon_database_url_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:5000](http://localhost:5000)

## Available Scripts

- **`npm run dev`** - Starts both client and server in development mode
- **`npm run build`** - Builds the app for production
- **`npm run preview`** - Preview the production build locally

## Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **3D Rendering**: Three.js with React Three Fiber
- **UI Components**: Radix UI primitives with shadcn/ui and Tailwind CSS
- **State Management**: Zustand stores for scene objects and editor state

### Backend
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **File Handling**: Multer middleware for texture uploads
- **AI Integration**: OpenAI API for scene generation

### 3D Scene
- **Camera**: OrthographicCamera with fixed isometric viewing angle
- **Controls**: OrbitControls with restricted rotation
- **Grid System**: Snap-to-grid with 0.5 unit increments
- **Asset Formats**: GLTF/GLB 3D models with fallback geometry

## Controls

### Keyboard Shortcuts
- **Q** - Select tool
- **W** - Move tool  
- **E** - Rotate tool
- **R** - Scale tool
- **G** - Toggle grid
- **Delete** - Delete selected object
- **Ctrl+Z** - Undo
- **Ctrl+Y** - Redo

### Mouse Controls
- **Left Click** - Select objects
- **Drag** - Move objects (when in move mode)
- **Right Click + Drag** - Rotate camera
- **Scroll** - Zoom in/out

## Project Structure

```
trimension/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and stores
│   │   └── pages/        # Page components
│   └── public/           # Static assets (3D models, textures)
├── server/                # Express.js backend
│   ├── routes/           # API route handlers
│   ├── services/         # Business logic services
│   └── storage.ts        # File storage configuration
├── shared/                # Shared types and schemas
└── uploads/              # User-uploaded textures
```

## Development

### Adding New Assets
1. Place 3D models in `client/public/assets/models/`
2. Add thumbnails in `client/public/assets/thumbnails/`
3. Update the asset configuration in `client/src/lib/assets.ts`

### Custom Textures
- Supported formats: PNG, JPG
- Maximum file size: 10MB
- Upload via the texture dialog in the editor

## Deployment

The application is built with Vite and can be deployed to any static hosting service. The backend API can be deployed separately to platforms like:
- Vercel
- Netlify
- Railway
- Heroku

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - React renderer for Three.js
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [OpenAI](https://openai.com/) - AI scene generation capabilities
