# ASM-Studio Pro - Quick Start Guide

Get up and running with ASM-Studio Pro in under 5 minutes!

---

## 🚀 For Developers

### Prerequisites

- Node.js 18+ and npm 9+
- MongoDB 7.0+
- Redis 7+
- Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/asm-studio-pro.git
cd asm-studio-pro

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# 4. Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_api_key_here

# 5. Start MongoDB and Redis (if not running)
# Using Docker:
docker run -d -p 27017:27017 --name mongodb mongo:7.0
docker run -d -p 6379:6379 --name redis redis:7-alpine

# 6. Start the development server
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

---

## 🐳 Using Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/asm-studio-pro.git
cd asm-studio-pro

# 2. Set up environment variables
cp .env.example .env
# Edit .env and add your Gemini API key

# 3. Start all services with Docker Compose
docker-compose up -d

# 4. Check logs
docker-compose logs -f

# 5. Access the application
# Frontend: http://localhost
# Backend: http://localhost:3000
```

---

## 🎓 For Students

### Getting Started

1. **Visit** https://asmstudio.dev (or your institution's URL)
2. **Sign up** with your email
3. **Start coding** immediately - no setup required!

### Your First Program

Try this simple addition program:

```asm
ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    NUM1 DB 10H
    NUM2 DB 20H
    RESULT DB ?
DATA ENDS

CODE SEGMENT
START:
    MOV AX, DATA
    MOV DS, AX
    
    MOV AL, NUM1
    ADD AL, NUM2
    MOV RESULT, AL
    
    MOV AH, 4CH
    INT 21H
CODE ENDS
END START
```

**Steps:**
1. Paste the code in the editor
2. Click **Run** (or press F5)
3. Watch the AI execute your code step-by-step!

### Ask the AI

Type questions in the chat panel:
- "Why do we need to set DS?"
- "What does the ADD instruction do?"
- "How do I create a loop?"

---

## 👨‍🏫 For Instructors

### Setting Up Your First Class

1. **Sign up** as an instructor at https://asmstudio.dev/signup?role=instructor
2. **Create a classroom**:
   - Go to Dashboard → Classes → New Class
   - Enter class name (e.g., "CS201 - Computer Architecture")
   - Get your class code (e.g., `ABC123`)
3. **Share the code** with your students
4. **Create assignments**:
   - Click on your class → Assignments → New Assignment
   - Write description and starter code
   - Add test cases for auto-grading

### Creating an Auto-Graded Assignment

Example: "Write a program that adds two numbers"

**Test Cases:**
```json
[
  {
    "description": "Test 1: 10h + 20h",
    "input": { "NUM1": "10h", "NUM2": "20h" },
    "expectedOutput": { "RESULT": "30h" },
    "points": 50
  },
  {
    "description": "Test 2: FFh + 01h (with carry)",
    "input": { "NUM1": "FFh", "NUM2": "01h" },
    "expectedOutput": { "RESULT": "00h", "CF": 1 },
    "points": 50
  }
]
```

Students submit their code, and it's automatically graded!

---

## 🔧 Configuration

### Environment Variables

Key variables to configure in `.env`:

```bash
# Required
GEMINI_API_KEY=your_api_key_here

# Optional - Database
MONGODB_URI=mongodb://localhost:27017/asmstudio
REDIS_URL=redis://localhost:6379

# Optional - Features
ENABLE_COLLABORATION=true
ENABLE_AUTO_GRADING=true
ENABLE_AI_ASSISTANT=true

# Optional - Performance
MAX_EXECUTION_STEPS=10000
EXECUTION_TIMEOUT_MS=5000
```

---

## 📝 Testing the AI Engine

### Quick Test

```bash
# Navigate to AI engine
cd ai-engine

# Install dependencies
npm install

# Create a test file
cat > test.ts << 'EOF'
import { aiEngine } from './src/index';

async function test() {
  await aiEngine.initialize();
  
  const code = `
ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    NUM DB 42H
DATA ENDS

CODE SEGMENT
START:
    MOV AX, DATA
    MOV DS, AX
    MOV AL, NUM
    MOV AH, 4CH
    INT 21H
CODE ENDS
END START
  `;
  
  const result = await aiEngine.processCode(code);
  console.log(result);
}

test();
EOF

# Run the test
npx tsx test.ts
```

You should see the AI compile and execute the code with full explanations!

---

## 🎨 Customization

### Changing AI Behavior

Edit the system prompts in `/prompts/`:

1. **CORE_SYSTEM_PROMPT.md** - Main AI personality and rules
2. **INTERFACE_TEMPLATES.md** - Output formatting
3. **EXAMPLES.md** - Example interactions

After editing, restart the AI engine:

```bash
cd ai-engine
npm run dev
```

### Customizing the UI

Frontend uses TailwindCSS. Edit `frontend/tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // Change primary color
        secondary: '#10B981',  // Change secondary color
      },
    },
  },
};
```

---

## 🐛 Troubleshooting

### Common Issues

**Problem**: "Cannot connect to MongoDB"
```bash
# Solution: Start MongoDB
docker run -d -p 27017:27017 mongo:7.0
```

**Problem**: "Gemini API error"
```bash
# Solution: Check your API key in .env
echo $GEMINI_API_KEY
# If empty, add it to .env file
```

**Problem**: "Port 3000 already in use"
```bash
# Solution: Change port in .env
PORT=3001
```

**Problem**: "AI responses are slow"
```bash
# Solution: Enable caching in .env
REDIS_URL=redis://localhost:6379
# Responses will be cached for faster subsequent requests
```

### Getting Help

- 📖 **Documentation**: https://docs.asmstudio.dev
- 💬 **Discord**: https://discord.gg/asmstudio
- 📧 **Email**: support@asmstudio.dev
- 🐛 **Issues**: https://github.com/yourusername/asm-studio-pro/issues

---

## 📚 Next Steps

### Learn More

1. **Read the Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
2. **Explore Examples**: Check [prompts/EXAMPLES.md](prompts/EXAMPLES.md)
3. **API Documentation**: Visit http://localhost:3000/api/docs
4. **Tutorials**: https://asmstudio.dev/tutorials

### Build Something Cool

Try these projects:
- ✅ Calculator (add, subtract, multiply, divide)
- ✅ String reversal program
- ✅ Bubble sort implementation
- ✅ Fibonacci sequence generator
- ✅ Simple text-based game

### Contribute

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code style guidelines
- Pull request process
- Feature requests
- Bug reports

---

## 🎯 Quick Reference

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `F5` | Run code |
| `F9` | Toggle breakpoint |
| `F10` | Step over |
| `F11` | Step into |
| `Ctrl+S` | Save code |
| `Ctrl+/` | Toggle comment |
| `Ctrl+Space` | Trigger IntelliSense |

### AI Commands

| Command | Description |
|---------|-------------|
| `/fast` | Enable fast mode (minimal output) |
| `/teach` | Enable teaching mode (extra explanations) |
| `/debug` | Enable debug mode (maximum verbosity) |
| `/normal` | Return to standard mode |
| `/optimize` | Get optimization suggestions |
| `/explain <line>` | Explain specific line |

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/login` | POST | Login |
| `/api/code` | GET | List user's code |
| `/api/code` | POST | Create new code |
| `/api/execution/run` | POST | Execute code |
| `/api/ai/ask` | POST | Ask AI a question |

---

## ✅ Checklist

Before deploying to production:

- [ ] Change default passwords in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS whitelist
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Configure backups (MongoDB)
- [ ] Set up error tracking (Sentry)
- [ ] Load test the application
- [ ] Review security headers (Helmet.js)
- [ ] Set up CI/CD pipeline

---

**Happy Coding! 🚀**

Need help? Join our [Discord community](https://discord.gg/asmstudio) or email support@asmstudio.dev
