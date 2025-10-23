# 🔐 Admin Monitoring System

## Overview

Simple admin system to monitor **anonymous student activity** without requiring sign-in.

---

## How It Works

### For Students:
- ✅ **No login required** - Just open editor and code
- ✅ Each browser gets tracked anonymously via sessionId
- ✅ System tracks: code executed, errors, execution count
- ✅ Students never see tracking - fully invisible

### For Admin (You):
- ✅ **ONE secret admin account**
- ✅ Monitor all student activity
- ✅ See common errors
- ✅ Track usage statistics
- ✅ Clean up old sessions

---

## 🔧 Setup

### 1. Add Admin Secret Key to `.env`

Open `backend/.env` and add:

```env
ADMIN_SECRET_KEY=your-secret-admin-key-here-change-this
```

**Generate a secure key:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Restart Backend
```bash
cd backend
npm run dev
```

---

## 📊 Admin API Endpoints

### Dashboard Overview
```bash
GET /api/admin/dashboard
Header: x-admin-key: your-secret-admin-key-here

Response:
{
  "success": true,
  "dashboard": {
    "activeStudents24h": 15,
    "totalStudentsThisWeek": 45,
    "totalExecutions": 234,
    "commonErrors": [
      { "error": "Undefined symbol", "count": 12 },
      { "error": "Invalid instruction", "count": 8 }
    ]
  }
}
```

### View All Sessions
```bash
GET /api/admin/sessions?page=1&limit=50
Header: x-admin-key: your-secret-admin-key-here

Response:
{
  "success": true,
  "sessions": [
    {
      "sessionId": "abc123",
      "executionCount": 5,
      "errorMessages": ["Undefined symbol"],
      "startTime": "2025-01-23T00:00:00Z",
      "lastActivity": "2025-01-23T01:30:00Z",
      "ipAddress": "192.168.1.1"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 1
  }
}
```

### View Specific Session
```bash
GET /api/admin/sessions/abc123
Header: x-admin-key: your-secret-admin-key-here
```

### Clean Up Old Sessions
```bash
DELETE /api/admin/sessions/old
Header: x-admin-key: your-secret-admin-key-here

# Deletes sessions older than 30 days
```

---

## 🧪 Test the Admin API

### Using cURL:

```bash
# Get dashboard
curl -X GET http://localhost:3001/api/admin/dashboard \
  -H "x-admin-key: your-secret-admin-key-here"

# Get sessions
curl -X GET http://localhost:3001/api/admin/sessions \
  -H "x-admin-key: your-secret-admin-key-here"
```

### Using Postman/Thunder Client:

1. **Method:** GET
2. **URL:** `http://localhost:3001/api/admin/dashboard`
3. **Headers:**
   - Key: `x-admin-key`
   - Value: `your-secret-admin-key-here`

---

## 📈 What Gets Tracked

### Per Session:
- ✅ `sessionId` - Unique browser identifier
- ✅ `codeExecuted` - Last code they ran
- ✅ `executionCount` - Number of times they clicked Run
- ✅ `errorMessages` - All errors they encountered
- ✅ `startTime` - When they first opened editor
- ✅ `lastActivity` - Most recent activity
- ✅ `ipAddress` - Their IP (optional)
- ✅ `userAgent` - Browser info

### Aggregated Stats:
- Active students last 24 hours
- Total students this week
- Total code executions
- Most common errors (top 10)

---

## 🎯 Use Cases

### Monitor Student Activity:
```
- How many students used editor today?
- What errors are students getting most?
- Which sessions are most active?
```

### Identify Issues:
```
- If many students get same error → Fix examples/instructions
- Low activity → Maybe assignment is too hard
- High error rate → Need better explanations
```

### Clean Up Data:
```
- Delete sessions older than 30 days
- Keep database clean and fast
```

---

## 🔒 Security

- ✅ Secret key required for all admin endpoints
- ✅ Key stored in `.env` (not in code)
- ✅ 403 error if wrong/missing key
- ✅ Students never see admin functionality
- ✅ No admin UI in student-facing app

---

## 💡 Future Enhancements

Want to add:
- 📊 Visual admin dashboard (charts, graphs)
- 🔔 Real-time activity feed
- 📧 Email alerts for common errors
- 📥 Export data to CSV
- 🎯 Filter sessions by date/error

---

## 📝 Quick Reference

**Add to `.env`:**
```env
ADMIN_SECRET_KEY=your-generated-key-here
```

**Check dashboard:**
```bash
curl http://localhost:3001/api/admin/dashboard \
  -H "x-admin-key: your-key"
```

**Files Created:**
- `backend/src/models/Session.ts` - Track student sessions
- `backend/src/routes/admin.ts` - Admin API endpoints
- `backend/src/index.ts` - Updated with admin routes

---

**The admin system is ready! Just add `ADMIN_SECRET_KEY` to your `.env` file and restart the backend.** 🎉
