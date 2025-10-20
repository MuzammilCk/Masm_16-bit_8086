# ASM-Studio AI Engine

AI-powered assembly language compiler, executor, and teaching assistant using Google's Gemini 2.0 Flash.

## Features

- 🤖 **Code Compilation** - Validate and compile MASM assembly code
- 🔍 **Step-by-step Execution** - Simulate 8086 CPU execution
- 🐛 **Interactive Debugging** - Set breakpoints and inspect state
- 📚 **Educational Explanations** - Learn assembly concepts
- ⚡ **Code Optimization** - Get performance improvement suggestions

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
```

### 3. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste it into your `.env` file

## Usage

### Development Mode

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## API

### Initialize AI Engine

```typescript
import { aiEngine } from '@asmstudio/ai-engine';

await aiEngine.initialize();
```

### Process Assembly Code

```typescript
const code = `
; Hello World Program
MOV AX, 1
MOV BX, 2
ADD AX, BX
`;

const result = await aiEngine.processCode(code);
console.log(result);
```

### Ask Questions

```typescript
const answer = await aiEngine.askQuestion(
  'What does the MOV instruction do in 8086 assembly?'
);
console.log(answer);
```

### Debug Code

```typescript
const debugInfo = await aiEngine.debugCode(code, 'step');
console.log(debugInfo);
```

### Optimize Code

```typescript
const suggestions = await aiEngine.optimizeCode(code);
console.log(suggestions);
```

### Clear History

```typescript
aiEngine.clearHistory();
```

## Integration with Backend

The AI engine can be used as a standalone service or integrated with the backend API.

### Standalone Service (Docker)

```bash
docker-compose up ai-engine
```

### Import in Backend

```typescript
import { aiEngine } from '../ai-engine/src/index.js';

// Initialize
await aiEngine.initialize();

// Use in API routes
app.post('/api/compile', async (req, res) => {
  const { code } = req.body;
  const result = await aiEngine.processCode(code);
  res.json({ result });
});
```

## System Prompts

The AI engine uses specialized prompts located in `/prompts`:

- `CORE_SYSTEM_PROMPT.md` - Main system instructions
- `INTERFACE_TEMPLATES.md` - Response format templates
- `EXAMPLES.md` - Example interactions

## Error Handling

All methods throw errors that should be caught:

```typescript
try {
  const result = await aiEngine.processCode(code);
} catch (error) {
  console.error('AI processing failed:', error);
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `GEMINI_MODEL` | Model to use | `gemini-2.0-flash-exp` |
| `REDIS_URL` | Redis cache URL (optional) | - |

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Linting & Formatting

```bash
# Lint
npm run lint

# Format
npm run format
```

## Architecture

```
ai-engine/
├── src/
│   └── index.ts          # Main AI engine class
├── dist/                 # Compiled output
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env.example
```

## License

MIT
