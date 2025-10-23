# 🔐 Admin Dashboard Access

## How to Access as Admin

### 1. Go to Admin Page
Open your browser and visit:
```
http://localhost:3000/admin/dashboard
```

### 2. Enter Your Secret Key
When prompted, paste your admin key:
```
32f5472fafae4acef25670ca28f4c5fd9c7f4a00e90f4d1e9842a82f17fc2aea
```

### 3. View Dashboard!
You'll see:
- ✅ Active students (last 24 hours)
- ✅ Total students this week
- ✅ Total code executions
- ✅ Most common errors
- ✅ All student sessions (with pagination)

---

## 📊 Dashboard Features

### Stats Cards:
- **Active Students (24h)** - How many students used it today
- **Students This Week** - Weekly total
- **Total Executions** - How many times code was run
- **Unique Errors** - Number of different errors encountered

### Common Errors Section:
- See which errors students get most
- Helps you identify common problems
- Shows count for each error

### Sessions Table:
- Session ID (unique per student)
- Number of executions per student
- Error count per student  
- Last activity time
- IP address (if available)
- Pagination for large datasets

### Actions:
- **Refresh** - Update data
- **Logout** - Clear your session
- **Pagination** - Navigate through sessions

---

## 🔒 Security

- ✅ Key stored in localStorage (stays logged in)
- ✅ Logout clears key
- ✅ Invalid key = access denied
- ✅ Key never exposed to students
- ✅ Backend validates every request

---

## 👨‍🎓 For Students

Students just go to:
```
http://localhost:3000/editor
```

**No login needed!** They:
- Start coding immediately
- Never see admin features
- Get tracked anonymously
- Don't know they're being monitored

---

## 🎯 Quick Start

1. **Backend must be running:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Add key to `.env`:**
   ```env
   ADMIN_SECRET_KEY=32f5472fafae4acef25670ca28f4c5fd9c7f4a00e90f4d1e9842a82f17fc2aea
   ```

3. **Visit admin page:**
   ```
   http://localhost:3000/admin/dashboard
   ```

4. **Enter key and you're in!** 🎉

---

## 💡 Tips

### Bookmark the URL:
Save `http://localhost:3000/admin/dashboard` in your bookmarks

### Keep Key Safe:
Your key is like a password - don't share it!

### Refresh Often:
Click "Refresh" to see latest student activity

### Check Common Errors:
If many students have same error, maybe improve examples

---

## 🎨 What It Looks Like

**Login Screen:**
- Clean, centered form
- Password field for secret key
- Error messages if wrong key

**Dashboard:**
- Dark theme (easy on eyes)
- 4 stat cards at top
- Common errors list
- Sessions table with pagination
- Refresh and Logout buttons

---

**You're all set! Just visit the URL and enter your key!** 🚀
