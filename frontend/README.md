# 🧠 MindSpace Frontend

> React-based frontend for MindSpace with mind-themed UI and AI-powered features

## 🚀 Quick Start

```bash
npm install
npm run dev
```

The app will run at `http://localhost:5173`

## 📦 Tech Stack

- **React 19.1.1** - UI library with latest features
- **Vite** - Fast build tool with HMR
- **Tailwind CSS v4** - Custom mind-themed design system
- **React Router 7** - Client-side routing
- **ReactFlow 11** - Mind map visualization
- **Dagre** - Graph layout algorithm
- **Axios** - HTTP client
- **html-to-image** - PNG export

## 🎨 Features

### Components
- **ChatBox** - AI chat interface with streaming responses
- **ArtGenerator** - AI artwork generation from prompts
- **MindMapBuilder** - Interactive mind map creator with:
  - Multiple node types (Topic, Idea, Process, Decision)
  - AI-powered generation
  - Vertical/Horizontal layouts
  - PNG/JSON export and import
  - Drag-and-drop interface
- **TaskList** - Task management component

### Pages
- **Home** - Landing page with all features
- **Dashboard** - User dashboard (future feature)

## 🎨 Design System

### Colors
- Deep purples: `purple-400`, `purple-500`, `purple-600`
- Electric blues: `cyan-400`, `cyan-500`
- Vibrant pinks: `pink-400`, `pink-500`
- Slate grays: `slate-950`, `slate-900`, `slate-800`, `slate-700`

### Animations
- `float` - Floating orb animation
- `glow` - Pulsing glow effect
- `shimmer` - Shimmering gradient
- `pulse-glow` - Pulsing box shadow

### Custom Components
- `.btn-primary` - Primary gradient button
- `.btn-secondary` - Secondary outline button
- `.btn-success` - Success green button
- `.card` - Glassmorphism card with blur
- `.input-field` - Styled input with focus effects
- `.message-user` / `.message-ai` - Chat message bubbles
- `.feature-card` - Interactive feature cards

## 📁 Project Structure

```
src/
├── components/
│   ├── ArtGenerator.jsx    # AI art generation
│   ├── ChatBox.jsx          # Chat interface
│   ├── MindMapBuilder.jsx   # Mind map creator
│   └── TaskList.jsx         # Task management
├── pages/
│   ├── Home.jsx             # Main landing page
│   └── Dashboard.jsx        # User dashboard
├── api/
│   └── api.js               # API client config
├── App.jsx                  # Main app with routing
├── index.css                # Global styles & animations
└── main.jsx                 # App entry point
```

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Integration

The frontend connects to the FastAPI backend at `http://localhost:5000`:

```javascript
// src/api/api.js
const API_BASE_URL = 'http://localhost:5000/api';
```

### Endpoints Used
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/art` - Generate artwork
- `GET /api/ai/health` - Health check
- `GET /api/tasks/{user_id}` - Get tasks
- `POST /api/tasks` - Create task

## 🎯 Development Tips

### Hot Module Replacement (HMR)
Vite provides instant HMR. Edit any component and see changes immediately without page refresh.

### Mind Map Builder
- Use the top toolbar for AI generation and layout controls
- Bottom toolbar contains draggable node types
- Right overlay shows node editor when a node is selected
- Export to PNG captures the complete diagram

### Custom Styling
All custom styles are in `index.css` with Tailwind utilities. The design uses:
- Glassmorphism with `backdrop-blur`
- Gradient backgrounds with `bg-linear-to-*`
- Custom animations with `@keyframes`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
# Windows PowerShell
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9
```

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notes

- ESLint configuration is in `eslint.config.js`
- Tailwind config is in `tailwind.config.js`
- Vite config is in `vite.config.js`
- PostCSS config is in `postcss.config.js`

---

Part of the [MindSpace](../) project
