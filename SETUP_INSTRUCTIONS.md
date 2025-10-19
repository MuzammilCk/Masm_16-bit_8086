# ASM-Studio Pro - Setup Instructions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp ../.env.example .env.local

# 4. Edit .env.local and add your Gemini API key
# GEMINI_API_KEY=your_api_key_here

# 5. Start development server
npm run dev
```

The application will be available at **http://localhost:3000**

---

## 📦 What's Been Built

### ✅ Completed Features

1. **Next.js 15 Frontend**
   - App Router with React 19
   - TypeScript configuration
   - Tailwind CSS + custom design system
   - Dark/Light theme support

2. **Monaco Editor Integration**
   - Custom MASM language definition
   - Syntax highlighting (GitHub Dark theme)
   - IntelliSense (auto-completion)
   - Custom color theme

3. **State Management**
   - Zustand stores for editor and execution
   - React Query for data fetching
   - Theme provider (next-themes)

4. **Design System**
   - GitHub Dark color palette
   - JetBrains Mono font with ligatures
   - Custom animations (register changes, memory flashes)
   - Smooth transitions everywhere

5. **Core Components**
   - Landing page with hero section
   - Editor page with resizable panels
   - Code editor with MASM support
   - Status bar and toolbar (placeholders)

---

## 🎯 Next Steps (To Complete MVP)

### Phase 1: Core Functionality (Week 1)

#### 1. AI Integration
Create `/frontend/lib/ai/gemini.ts`:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function executeCode(code: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  // Load system prompt from /prompts/CORE_SYSTEM_PROMPT.md
  const systemPrompt = await loadSystemPrompt();
  
  const prompt = `${systemPrompt}\n\nExecute this code:\n\`\`\`asm\n${code}\n\`\`\``;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

#### 2. Execution Panel
Create `/frontend/components/execution/ExecutionPanel.tsx`:
- Display AI execution output
- Show step-by-step trace
- Register view
- Memory view
- Flags view

#### 3. AI Chat Panel
Create `/frontend/components/ai/AIChat.tsx`:
- Chat interface
- Message history
- Streaming responses
- Code suggestions

#### 4. Toolbar Component
Create `/frontend/components/editor/Toolbar.tsx`:
- Run button (F5)
- Stop button
- Theme toggle
- Settings menu

#### 5. Status Bar Component
Create `/frontend/components/editor/StatusBar.tsx`:
- Cursor position
- File name
- Execution status
- Error count

---

### Phase 2: Visual Debugger (Week 2)

#### 1. Time-Travel Debugging
- Execution timeline slider
- Step forward/backward
- Jump to any step
- Play/pause execution

#### 2. Register View
- Animated register changes
- Highlight modified registers
- Show hex/decimal/binary values

#### 3. Memory Inspector
- Interactive memory grid
- Hover tooltips
- Color-coded read/write
- Variable labels

#### 4. Breakpoints
- Click gutter to set breakpoint
- Breakpoint panel
- Conditional breakpoints

---

### Phase 3: AI Co-Pilot (Week 3)

#### 1. Inline Suggestions
- Ghost text rendering
- Tab to accept
- Context-aware suggestions

#### 2. Error Explainer
- One-click fixes
- Multiple solution options
- AI explanations

#### 3. Code Optimization
- Suggest improvements
- Show performance metrics
- Apply optimizations

---

### Phase 4: Polish & Deploy (Week 4)

#### 1. Animations
- Register change animations
- Memory flash effects
- Error slide-in
- Success checkmarks

#### 2. Mobile Optimization
- Responsive layouts
- Touch gestures
- Collapsible panels

#### 3. Performance
- Code splitting
- Lazy loading
- Image optimization
- Caching

#### 4. Deployment
- Vercel deployment
- Environment variables
- Custom domain
- Analytics

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npm run type-check
```

---

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Landing page ✅
│   ├── editor/page.tsx      # Editor page ✅
│   ├── layout.tsx           # Root layout ✅
│   ├── providers.tsx        # Context providers ✅
│   └── globals.css          # Global styles ✅
│
├── components/
│   ├── editor/
│   │   ├── CodeEditor.tsx   # Monaco editor ✅
│   │   ├── Toolbar.tsx      # TODO
│   │   └── StatusBar.tsx    # TODO
│   ├── execution/
│   │   ├── ExecutionPanel.tsx  # TODO
│   │   ├── RegisterView.tsx    # TODO
│   │   └── MemoryInspector.tsx # TODO
│   └── ai/
│       └── AIChat.tsx       # TODO
│
├── lib/
│   ├── monaco/
│   │   ├── language.ts      # MASM language ✅
│   │   └── theme.ts         # Custom theme ✅
│   └── ai/
│       └── gemini.ts        # TODO
│
├── store/
│   ├── editorStore.ts       # Editor state ✅
│   └── executionStore.ts    # Execution state ✅
│
└── package.json             # Dependencies ✅
```

---

## 🎨 Design Tokens

All design tokens are defined in `/frontend/app/globals.css`:

- **Colors**: GitHub Dark palette
- **Fonts**: Inter (UI), JetBrains Mono (code)
- **Animations**: Register changes, memory flashes, error slide-ins
- **Transitions**: 0.15s cubic-bezier(0.4, 0, 0.2, 1)

---

## 🐛 Troubleshooting

### Monaco Editor not loading
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### TypeScript errors
```bash
# Regenerate types
npm run type-check
```

### Tailwind not working
```bash
# Rebuild CSS
npm run dev
```

---

## 📚 Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Monaco Editor**: https://microsoft.github.io/monaco-editor/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/
- **Gemini API**: https://ai.google.dev/docs

---

## ✅ Checklist

### Completed
- [x] Next.js 15 setup
- [x] Tailwind CSS configuration
- [x] Monaco Editor integration
- [x] MASM language definition
- [x] Custom theme (GitHub Dark)
- [x] State management (Zustand)
- [x] Landing page
- [x] Editor page layout
- [x] Code editor component

### TODO
- [ ] AI integration (Gemini)
- [ ] Execution panel
- [ ] AI chat panel
- [ ] Toolbar component
- [ ] Status bar component
- [ ] Register view
- [ ] Memory inspector
- [ ] Time-travel debugger
- [ ] Inline AI suggestions
- [ ] Error explainer
- [ ] Animations
- [ ] Mobile optimization
- [ ] Deployment

---

**Ready to build the future of assembly language education! 🚀**
