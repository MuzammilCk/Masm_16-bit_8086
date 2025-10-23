# 🔐 Admin Dashboard Guide

## Overview

The Admin Dashboard allows instructors and administrators to monitor student activity in real-time, track execution statistics, and identify common errors.

## Setup

### 1. Set Admin Secret Key

In your `backend/.env` file, set a strong admin key:

```bash
# Generate a secure random key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to backend/.env
ADMIN_SECRET_KEY=your_generated_secret_key_here
```

### 2. Restart Backend

```bash
cd backend
npm run dev
```

### 3. Access Dashboard

Navigate to: `http://localhost:3000/admin/dashboard`

## Login

1. Enter your `ADMIN_SECRET_KEY` from `backend/.env`
2. Click "Access Dashboard"
3. The key is stored in your browser for future access

## Dashboard Features

### 📊 Real-Time Statistics

- **Active Students (24h)** - Students who executed code in the last 24 hours
- **Students This Week** - Total unique students this week
- **Total Executions** - Cumulative code execution count
- **Unique Errors** - Number of different error types encountered

### 🐛 Common Errors

View the most frequently occurring errors with:
- Error message
- Occurrence count
- Helps identify teaching opportunities

### 👥 Student Sessions

Monitor individual student activity:
- **Student Name** - Username (or Anonymous)
- **Executions** - Number of code runs
- **Errors** - Number of errors encountered
- **Last Activity** - Most recent execution timestamp
- **Session ID** - Unique session identifier

### Features:
- **Pagination** - Browse through all sessions
- **Real-time** - Click "Refresh" to update data
- **Persistent** - Data stored in MongoDB

## How Session Tracking Works

### Automatic Tracking

When students execute code, the system automatically tracks:
1. **Session ID** - Generated per browser session
2. **Username** - From login (or "Anonymous")
3. **Execution Count** - Incremented per run
4. **Error Messages** - Any errors encountered
5. **Last Activity** - Timestamp of last execution
6. **Code Executed** - Last code snippet run

### Data Collection

- **Client-Side**: Frontend sends sessionId and username with each execution
- **Server-Side**: Backend creates/updates Session records in MongoDB
- **Privacy**: Only error messages and execution counts are stored, not all code history

## Security

### Admin Key Protection

- The admin key is **required** for all admin endpoints
- Sent via `X-Admin-Key` header
- Invalid keys receive 403 Forbidden
- Key is stored in browser localStorage

### Best Practices

1. **Use strong keys**: Generate with crypto.randomBytes
2. **Keep it secret**: Never commit `.env` files
3. **Rotate regularly**: Change admin key periodically
4. **Limit access**: Only share with trusted instructors

## Troubleshooting

### "Invalid admin key"

- **Cause**: ADMIN_SECRET_KEY mismatch between `.env` and login
- **Fix**: 
  1. Check `backend/.env` for correct key
  2. Restart backend if you changed the key
  3. Logout and login again with correct key

### "No sessions recorded yet"

- **Cause**: No students have executed code yet
- **Fix**:
  1. Run code in the editor at `http://localhost:3000/editor`
  2. Check MongoDB connection
  3. Verify Session model is properly initialized

### "Failed to load dashboard"

- **Cause**: Backend not running or MongoDB connection issue
- **Fix**:
  1. Ensure backend is running on port 3001
  2. Check MongoDB is running: `mongosh`
  3. Verify `MONGODB_URI` in `backend/.env`

### Dashboard shows 0 for all stats

- **Cause**: Sessions not being created during execution
- **Fix**:
  1. Restart backend (ensures latest code is running)
  2. Hard refresh frontend: `Ctrl+Shift+R`
  3. Run code in editor to create a test session
  4. Refresh admin dashboard

## API Endpoints

For advanced users, the admin API provides:

```bash
# Get dashboard stats
GET /api/admin/dashboard
Headers: X-Admin-Key: your_key

# Get all sessions (paginated)
GET /api/admin/sessions?page=1&limit=20
Headers: X-Admin-Key: your_key

# Get specific session
GET /api/admin/sessions/:sessionId
Headers: X-Admin-Key: your_key

# Clean up old sessions (>30 days)
DELETE /api/admin/sessions/old
Headers: X-Admin-Key: your_key
```

## Privacy & Data Retention

### What's Stored:
- Session ID (random identifier)
- Username
- Execution count
- Error messages
- Timestamps
- Last code snippet

### What's NOT Stored:
- Full code history
- API keys
- Passwords
- Personal information

### Auto-Cleanup:
- Old sessions can be manually deleted via API
- Consider adding a cron job to clean sessions >30 days old

## Example Usage

### For Instructors:

1. **Monitor Class Activity**
   - Check active students during class hours
   - Identify students who need help (high error counts)

2. **Identify Common Mistakes**
   - Review "Most Common Errors"
   - Prepare targeted explanations/tutorials

3. **Track Engagement**
   - Monitor total executions over time
   - Compare weekly student counts

### For Administrators:

1. **System Health**
   - Monitor total executions for capacity planning
   - Track error rates for system issues

2. **User Analytics**
   - Understand usage patterns
   - Identify peak hours

## Future Enhancements

Potential improvements:
- 📈 Charts and graphs for trends
- 📧 Email alerts for high error rates
- 📊 Export data to CSV
- 🎯 Filter by date range
- 👤 View individual student history
- 🔍 Search sessions by username

## Status

✅ **Fully Functional** - Admin dashboard is now tracking all executions and errors!

---

**Need Help?** Check your backend logs for detailed error messages or session tracking information.
