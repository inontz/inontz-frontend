# Cosmic Chat 🤖🌌

A beautiful, animated AI chat web application with a space/universe theme, supporting **Ollama**, **OpenAI**, **OpenWebUI**, and **OpenCode**.

[![Install PWA](https://img.shields.io/badge/Install-PWA-blue)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

## ✨ Features

- **🌌 Cosmic Space Theme**: Beautiful animated UI with stars, planets, and aurora effects
- **🤖 Multi-Provider Support**: 
  - 🦙 **Ollama** - Your local Ollama instance
  - 🤖 **OpenAI** - GPT models via OpenAI API
  - 🌐 **OpenWebUI** - Your OpenWebUI instance
  - 💻 **OpenCode** - OpenCode AI
- **📦 Model Management**: Auto-fetches available models from your chosen provider
- **💫 Real-time Streaming**: Smooth streaming responses
- **🎨 Customizable Themes**: 6 theme colors to choose from
- **📱 PWA Support**: Install as a standalone app on mobile/desktop
- **♿ Fully Responsive**: Works on mobile, tablet, and desktop
- **🌙 Dark Mode**: Optimized for night viewing

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting!

## 📱 Progressive Web App (PWA)

Cosmic Chat is a fully-featured PWA that can be installed on:
- 📱 iOS Safari (Add to Home Screen)
- 🤖 Android Chrome (Install App)
- 💻 Desktop Chrome/Edge (Install)

### Installing the PWA

**On iOS (Safari):**
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

**On Android (Chrome):**
1. Open the app in Chrome
2. Tap the menu (3 dots)
3. Tap "Install App" or "Add to Home Screen"

**On Desktop (Chrome/Edge):**
1. Look for the install icon in the address bar
2. Click "Install"

### Offline Support

The PWA caches static assets for offline use. API calls require an internet connection.

## ⚙️ Configuration

Click **Settings** in the header or sidebar to choose your AI provider:

### 🦙 Ollama
- **Default**: `https://ollama.inontz.me`
- **Custom**: Enter your Ollama endpoint URL
- **API Key**: Optional authentication

### 🤖 OpenAI
- **Endpoint**: `https://api.openai.com/v1` (fixed)
- **API Key**: Required - get yours at [platform.openai.com](https://platform.openai.com)

### 🌐 OpenWebUI
- **Default**: `https://openwebui.inontz.me`
- **Custom**: Your OpenWebUI instance URL
- **API Key**: Optional

### 💻 OpenCode
- **Default**: `https://opencode.inontz.me`
- **Custom**: Your OpenCode instance URL
- **API Key**: Optional

### 🎨 Theme Colors

Choose from 6 beautiful theme colors:
- 💜 Indigo (default)
- 🔮 Purple
- 🌸 Pink
- 💙 Blue
- 💚 Emerald
- 🧡 Orange

## 🛠️ Tech Stack

- **Framework**: Next.js 16 + React 19
- **Styling**: Tailwind CSS v4
- **Runtime**: Cloudflare Workers (Edge)
- **PWA**: Service Worker + Web App Manifest
- **Responsive**: Mobile-first design with PWA support

## 📱 Responsive Design

The app is fully responsive:
- **Mobile** (< 640px): Collapsible sidebar, optimized touch targets
- **Tablet** (640-1024px): Adapted layout
- **Desktop** (> 1024px): Full sidebar visible

### Mobile Features
- 📲 Swipe gestures
- 👆 Touch-optimized buttons (min 44px)
- 🔄 Pull-to-refresh support
- 📴 Safe area insets for notched devices

## 🔌 API Integration

All providers use their native streaming APIs:

- **Ollama**: `/api/tags` + `/api/chat`
- **OpenAI**: `/v1/models` + `/v1/chat/completions`
- **OpenWebUI**: `/api/v1/models` + `/api/chat/completions`
- **OpenCode**: `/api/v1/models` + `/api/chat/completions`

## 📝 Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy` | Deploy to Cloudflare |

## 🎨 Generating Icons

To generate proper PNG icons for the PWA:

### Option 1: Using the browser (easiest)
1. Open `public/icons/generate-icons.html` in your browser
2. Click "Generate All Icons"
3. Click "Download All"
4. Move the downloaded PNGs to `public/icons/`

### Option 2: Using ImageMagick
```bash
./scripts/generate-icons.sh
```

Or manually:
```bash
for size in 72 96 128 144 152 192 384 512; do
  convert -background "#6366f1" -fill white -gravity center \
    -size ${size}x${size} -pointsize $((size/2)) label:"🤖" \
    public/icons/icon-${size}x${size}.png
done
```

## 🌟 Credits

Made with 💜 for AI enthusiasts.

Special thanks to:
- [Ollama](https://ollama.ai/) - Local LLM platform
- [OpenAI](https://openai.com/) - GPT models
- [OpenWebUI](https://openwebui.com/) - Web UI
- [OpenCode](https://opencode.ai/) - AI assistant

---

*"Chat with the cosmos!"* 🚀✨
