# Architecture

## Overview

Cosmic Chat is a Next.js application deployed on Cloudflare Workers that provides a unified, space-themed interface for chatting with AI models from Cloudflare AI, OpenAI, and Google Gemini.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Client Browser                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         Starfield Background                            │ │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │ │
│  │  │                         Sidebar                                   │  │ │
│  │  │  ┌─────────────────────────────────────────────────────────────┐│  │ │
│  │  │  │  • Floating Planets (decorative)                            ││  │ │
│  │  │  │  • ☁️ Cloudflare AI                                        ││  │ │
│  │  │  │  • 🤖 OpenAI GPT                                           ││  │ │
│  │  │  │  • 💎 Google Gemini                                         ││  │ │
│  │  │  │  • External Links (VSCode, OpenCode, OpenWebUI)             ││  │ │
│  │  │  │  • ⚙️ Settings                                              ││  │ │
│  │  │  └─────────────────────────────────────────────────────────────┘│  │ │
│  │  │                      Model Selector                               │  │ │
│  │  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  │  🌌 Provider: [Cloudflare AI ▼]  ⭐ Model: [Llama 3.1 ▼]   │  │ │
│  │  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │  │                      Chat Area                                   │  │ │
│  │  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  │  🌟 User: Hello!                                          │  │ │
│  │  │  │  🌙 AI: Hi there! How can I help you today?                │  │ │
│  │  │  │                                                             │  │ │
│  │  │  │  Cosmic AI is thinking... ⚫⚫⚫                          │  │ │
│  │  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │  │                      Chat Input                                  │  │ │
│  │  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  │  [Send a message to the cosmos... 🌌]      [🚀]           │  │ │
│  │  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │  └──────────────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                           Settings Context                                   │
│  ┌──────────────────┐  ┌───────────────┐  ┌───────────────────────────────┐ │
│  │   Providers      │  │   Selected    │  │       Selected Model          │ │
│  │  ☁️🤖💎          │  │   Provider    │  │   (Predefined per provider)   │ │
│  └──────────────────┘  └───────────────┘  └───────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                              API Route (/api/chat)                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                    Multi-Provider Chat Handler                            ││
│  │  ┌─────────────────┬─────────────────┬─────────────────────────────────┐ ││
│  │  │  ☁️ Cloudflare  │  🤖 OpenAI      │  💎 Gemini                      │ ││
│  │  │  /{model}       │  /v1/chat       │  /models/{model}:generate       │ ││
│  │  │  Authorization  │  Authorization  │  ?key={apiKey}                  │ ││
│  │  └─────────────────┴─────────────────┴─────────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
     ┌────────▼────────┐ ┌────────▼────────┐ ┌────────▼────────┐
     │  Cloudflare AI  │ │     OpenAI      │ │  Google Gemini  │
     │  Workers AI     │ │    Platform     │ │     API         │
     └─────────────────┘ └─────────────────┘ └─────────────────┘
```

## Design System: Cosmic Theme

### Color Palette
```
Space Background:    #0a0a1a (deep space)
Glass Card:          rgba(15, 23, 42, 0.7)
Star Primary:        #6366f1 (indigo)
Star Secondary:      #a855f7 (purple)
Nebula Pink:         #ec4899
Nebula Blue:         #3b82f6
Sun:                 #fbbf24
Moon:                #94a3b8
Text Primary:        #f1f5f9
Text Secondary:      #94a3b8
```

### Visual Effects
- **Starfield**: Multiple layers of animated stars using radial gradients
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Glow Effects**: Pulse glow animations on interactive elements
- **Floating Planets**: CSS-animated decorative planets
- **Aurora Background**: Animated gradient shifts
- **Message Animations**: Pop-in effects with star/moon decorations

## Components

### SettingsContext

Central state management with predefined model lists:

**Predefined Models:**
- **Cloudflare**: Llama 3.1/3.2/3.3, Mistral 7B, Gemma, Qwen, DeepSeek
- **OpenAI**: GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-3.5 Turbo
- **Gemini**: Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash

### ChatContainer

Main orchestrator with cosmic theme elements:
- Aurora background overlay
- Floating planet decorations
- "Cosmic AI is thinking..." loading state
- Message counter: "X messages in orbit"
- Star and moon emojis for user/AI distinction

### API Route Multi-Provider Support

Each provider has different API structure:

**Cloudflare AI:**
```
POST {endpoint}/{model}
Headers: Authorization: Bearer {apiKey}
Body: { messages, stream }
```

**OpenAI:**
```
POST {endpoint}/v1/chat/completions
Headers: Authorization: Bearer {apiKey}
Body: { model, messages, stream }
```

**Gemini:**
```
POST {endpoint}/models/{model}:generateContent?key={apiKey}
Body: { contents: [{ role, parts: [{ text }] }] }
Response: Transformed to OpenAI-compatible format
```

## Data Flow

### Send Message (Multi-Provider)
```
User sends message
        │
        ▼
SettingsContext provides:
├── provider type (cloudflare/openai/gemini)
├── endpoint URL
├── API key
└── selected model
        │
        ▼
ChatContainer constructs request
        │
        ▼
POST /api/chat with provider type
        │
        ▼
API Route detects provider type
        │
        ├──► Cloudflare: /{model} endpoint
        ├──► OpenAI: /v1/chat/completions
        └──► Gemini: Transform messages + /models/{model}:generateContent
        │
        ▼
Stream response (or JSON for Gemini)
        │
        ▼
Parse and display with cosmic animations
```

### Model Selection
```
Provider selected
        │
        ▼
ModelSelector checks provider type
        │
        ▼
Get predefined models from getPredefinedModels()
        │
        ├──► Cloudflare: 9 models
        ├──► OpenAI: 4 models
        └──► Gemini: 4 models
        │
        ▼
Display in dropdown with star icons
        │
        ▼
User selects model with "✨" active indicator
```

## CSS Animation System

### Keyframe Animations
- `twinkle`: 5s starfield opacity cycle
- `float`: 6s vertical float for planets
- `float-slow`: 8s gentle rotation + float
- `pulse-glow`: 3s box-shadow pulse
- `sparkle`: 2s scale + rotate for decorations
- `orbit`: 10s 360° rotation with translation
- `aurora`: 15s gradient position shift
- `typing`: 1.4s dot bounce sequence
- `message-pop`: 0.3s scale-up entrance

### Animation Application
- `.float-anim`: Floating planets in sidebar
- `.pulse-glow`: Active buttons, message bubbles
- `.sparkle`: Star icons, decorations
- `.orbit`: Orbiting moon decorations
- `.typing-dot`: Loading indicator dots
- `.message-appear`: New message entrance

## Storage

### localStorage Schema
```typescript
{
  "ai-chat-providers": Provider[],
  "ai-chat-selected-provider": string, // provider ID
  "ai-chat-selected-model": string     // model ID
}
```

### Provider Schema
```typescript
interface Provider {
  id: string;           // UUID
  name: string;         // Display name with emoji
  type: ProviderType;    // 'cloudflare' | 'openai' | 'gemini'
  endpoint: string;     // Base API URL
  apiKey?: string;       // Optional authentication
  modelParam: string;   // Always 'model'
}
```

## Emoji System

### Provider Icons
- ☁️ Cloudflare AI
- 🤖 OpenAI
- 💎 Google Gemini

### UI Decorations
- ✨ Stars (active states, buttons)
- 🌙 Moons (AI messages, decorations)
- 🚀 Rockets (send button, create actions)
- 🌌 Galaxy (main theme, backgrounds)
- ⭐ Star icons (dropdowns, models)
- 🌑 Moon (cancel/inactive states)
- 🌟 Sparkles (success, new items)

## Responsive Design

### Desktop (lg+)
- Full sidebar with floating planets
- Expanded model dropdowns
- All decorative elements visible

### Mobile (< lg)
- Collapsible sidebar
- Compact model selector
- Hidden floating decorations
- Full-width chat bubbles

## Performance

### Optimizations
- Edge Runtime for fast global deployment
- CSS animations (GPU-accelerated)
- No heavy JavaScript libraries
- Tailwind JIT for minimal CSS
- Streaming responses for real-time feel

### Animation Performance
- `transform` and `opacity` only (composited)
- `will-change` hints where needed
- Reduced motion media query support
