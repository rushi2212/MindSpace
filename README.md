# 🧠 MindSpace - Neural Workspace

> A creative AI-powered workspace with mind-themed UI featuring chat, art generation, audio generation, brain canvas, and mind mapping capabilities.

![MindSpace](https://img.shields.io/badge/React-19.1.1-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Quick Links

- **[Deployment Guide](./DEPLOYMENT.md)** - Complete guide for deploying to Vercel, Render, Railway, or Docker
- **[Live Demo](#)** - Coming soon!
- **[Documentation](./README.md)** - This file

## ✨ Features

- **🤖 AI Chat Interface**: Interactive chat with AI assistant powered by Google Gemini
- **🎨 Art Generator**: Create stunning AI-generated artwork from text prompts
- **🎵 Audio Generator**: Generate audio content with AI
- **🎯 Brain Canvas**: Visual brainstorming space with interactive elements
- **🗺️ Mind Map Builder**: Create, edit, and export mind maps with multiple node types
  - Topic, Idea, Process, and Decision nodes
  - AI-powered mind map generation
  - Vertical/Horizontal layout options
  - Export to PNG and JSON
  - Import existing mind maps

## 🚀 Tech Stack

### Frontend
- **React 19.1.1** - Latest React with modern features
- **Vite** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first CSS with custom mind-themed design system
- **React Router** - Client-side routing
- **ReactFlow 11** - Node-based mind map visualization
- **Dagre** - Automatic graph layout
- **html-to-image** - PNG export functionality

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.10+** - Required Python version
- **Google Gemini API** - AI capabilities
- **SQLite** - Lightweight database
- **Uvicorn** - ASGI server

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.10+
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Clone the Repository
```bash
git clone https://github.com/rushi2212/MindSpace.git
cd MindSpace
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
# Windows PowerShell
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
# Windows PowerShell
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

5. Edit `.env` and add your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
DB_URL=sqlite:///backend.db
```

6. Start the backend server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

Backend will run at: `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

## 🎨 Design System

MindSpace features a custom mind-themed design with:
- **Colors**: Deep purples, electric blues, and vibrant cyans
- **Animations**: Floating orbs, glow effects, shimmer, and pulse animations
- **Components**: Glassmorphism cards, gradient buttons, backdrop blur effects
- **Typography**: Gradient text effects with animated underlines

## 📁 Project Structure

```
MindSpace/
├── backend/
│   ├── app/
│   │   └── main.py          # FastAPI application
│   ├── controllers/         # Route controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment template
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ArtGenerator.jsx
│   │   │   ├── ChatBox.jsx
│   │   │   ├── MindMapBuilder.jsx
│   │   │   └── TaskList.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   └── Home.jsx
│   │   ├── api/             # API client
│   │   ├── App.jsx          # Main app component
│   │   └── index.css        # Global styles
│   ├── package.json         # Node dependencies
│   └── vite.config.js       # Vite configuration
│
└── README.md                # This file
```

## 🔌 API Endpoints

### AI Routes
- `POST /api/ai/chat` - Send message to AI chat
- `POST /api/ai/art` - Generate artwork from prompt
- `GET /api/ai/health` - Check API health

### Task Routes
- `GET /api/tasks/{user_id}` - Get user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{task_id}` - Update task
- `DELETE /api/tasks/{task_id}` - Delete task

## 🎯 Usage

1. **Chat with AI**: Navigate to the home page and use the chat interface to interact with the AI assistant
2. **Generate Art**: Enter a prompt in the Art Generator to create AI artwork
3. **Create Mind Maps**: 
   - Use the Mind Map Builder to manually create nodes
   - Or use AI to generate a mind map from a topic
   - Export your mind maps as PNG or JSON
   - Import previously saved mind maps

## 🛠️ Development

### Build for Production

Frontend:
```bash
cd frontend
npm run build
```

Backend:
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 5000
```

### Linting

```bash
cd frontend
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Rushikesh** - [@rushi2212](https://github.com/rushi2212)

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- React Flow for mind map visualization
- Tailwind CSS for styling utilities
- FastAPI for the backend framework

---

Made with 💜 by Rushikesh
