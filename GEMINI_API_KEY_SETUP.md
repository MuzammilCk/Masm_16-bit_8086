# 🔑 Gemini API Key Setup Guide

## Overview

Each student now uses their **own Gemini API key** when signing in. This means:
- ✅ No single API key gets overused
- ✅ Each student has their own quota
- ✅ Fair usage distribution
- ✅ Students manage their own API costs

---

## 🎓 For Students

### Step 1: Get Your Free Gemini API Key

1. **Go to Google AI Studio:**
   - Visit: https://aistudio.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key:**
   - Click "Create API Key"
   - Copy the generated key (starts with `AIza...`)

### Step 2: Sign In to ASM-Studio Pro

1. **Open the app:**
   - Go to: `http://localhost:3000`
   - Click "Start Coding"

2. **Fill in the form:**
   - **Username:** Your name (e.g., `john_doe`)
   - **Password:** Any password you want
   - **Gemini API Key:** Paste your API key here

3. **Click "Sign In":**
   - System automatically creates your account
   - You're now logged in!

### Step 3: Start Coding!

- Write assembly code
- Click "Run" button
- Code executes using **your API key**
- No need to re-enter API key (it's saved)

---

## 🔒 Security & Privacy

### API Key Storage:
- ✅ Stored securely in database (not visible in responses)
- ✅ Encrypted in transit
- ✅ Only used for your code execution

### Remember Me Feature:
- Your API key is saved when you sign in
- No need to enter it again
- Stays until you clear browser data

---

## 💡 How It Works

### On Sign In:
```
1. You enter: Username + Password + API Key
2. System saves your API key to your account
3. API key stored in browser for quick access
```

### When Running Code:
```
1. You click "Run"
2. System uses YOUR API key
3. Code sent to Gemini with your key
4. Results come back to you
```

---

## 🎯 Benefits

### For Students:
- **Free to use** - Gemini has generous free tier
- **Your own quota** - Not shared with others
- **Fast execution** - No waiting in queues
- **Private** - Only you use your key

### For Admins:
- **No central API costs** - Each student pays their own
- **Easy scaling** - More students = no problem
- **Fair usage** - Everyone has equal access

---

## 📊 Gemini Free Tier

**What you get for FREE:**
- 15 requests per minute
- 1,500 requests per day
- Perfect for learning assembly!

**Paid tier (if needed):**
- $0.50 per 1M tokens
- Very affordable for students

---

## ❓ FAQ

### Q: Do I need to pay for Gemini?
**A:** No! The free tier is perfect for learning. You get 1,500 requests per day.

### Q: What if I lose my API key?
**A:** Generate a new one at https://aistudio.google.com/app/apikey and update it by signing in again with the new key.

### Q: Is my API key secure?
**A:** Yes! It's stored encrypted and never shown in responses.

### Q: Can I change my API key later?
**A:** Yes! Just sign in again with your new API key.

### Q: Do I need to enter the key every time?
**A:** No! It's saved after first sign-in. You stay logged in.

---

## 🚀 Quick Start

```
1. Get API key: https://aistudio.google.com/app/apikey
2. Go to: http://localhost:3000
3. Sign in with:
   - Username: your_name
   - Password: your_password
   - API Key: paste_here
4. Start coding!
```

---

## 🛠️ For Developers

### Backend Changes:
- `User` model has `geminiApiKey` field
- Auth routes accept and store API keys
- Execute route uses user's key from request

### Frontend Changes:
- Login page has API key input field
- API key stored in localStorage
- Sent with every execute request

### Database Schema:
```typescript
interface User {
  username: string;
  password: string;
  geminiApiKey?: string; // New field
  // ...
}
```

---

**Now each student brings their own API key - fair, secure, and scalable!** 🎉
