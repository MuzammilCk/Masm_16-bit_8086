# 🔄 OpenRouter API Key Setup

## ✅ What Changed

We've switched from **Gemini** to **OpenRouter with Grok** for AI functionality.

---

## 📝 Add API Key to Backend

Edit `backend/.env` and add these lines:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=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
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_SITE_NAME=ASM-Studio Pro
```

---

## 🚀 Restart Backend

```powershell
# Stop current backend (Ctrl+C)
cd backend
npm run dev
```

You should see:
```
🔑 OpenRouter API Key: sk-or-v1-...
✅ MongoDB connected successfully
📊 Database: asmstudio
🚀 ASM-Studio Backend running on port 3001
```

---

## ✅ What's Using OpenRouter Now

1. **AI Chat** (`/api/ai/chat`) - Grok-powered assistant
2. **Code Explanation** (`/api/ai/explain`) - Explains assembly code
3. **Error Fixes** (`/api/ai/fix`) - Suggests fixes for errors
4. **Code Execution** (`/api/execute`) - Compiles and simulates code

---

## 🧪 Test It

1. **Restart backend** with the new API key
2. **Refresh browser** (F5)
3. **Type in AI Chat**: "What is MOV instruction?"
4. **Get response from Grok!** ✨

---

## 🎯 Model Being Used

**Model**: `x-ai/grok-code-fast-1`
- Fast responses
- Code-specialized
- Perfect for assembly language help

---

## 📦 Files Modified

1. ✅ `backend/src/routes/ai.ts` - Switched to OpenRouter
2. ✅ `backend/src/routes/execute.ts` - Switched to OpenRouter
3. ✅ `backend/src/index.ts` - Updated logging
4. ✅ `backend/.env.example` - Added OpenRouter config

---

## 🔐 Your API Key

```
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
```

**Add this to `backend/.env` now!**
