# 🔄 Server-Side Traffic Tracking Setup

## Problem

**Current Issue:** localStorage is browser-specific. Each visitor only sees their own stats, not all visitors' stats combined.

## Solution

Added optional server-side tracking that aggregates stats from ALL visitors.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Upload PHP File

Upload `traffic-api.php` to your Apache server in the same directory as your CyberKit files:
```
/var/www/html/CyberKit/
├── index.html
├── app.obf.js
├── traffic-counter.js
├── traffic-api.php  ← Upload this
└── ...
```

### Step 2: Set Permissions

```bash
chmod 644 traffic-api.php
chmod 666 traffic-data.json  # Will be created automatically
```

Or set write permissions for the directory:
```bash
chmod 755 /var/www/html/CyberKit/
```

### Step 3: Test

1. Visit your site
2. Use a tool
3. Check if `traffic-data.json` is created
4. Stats should now show ALL visitors combined

---

## 📊 How It Works

### Client-Side (traffic-counter.js)
- Tracks locally (for privacy/offline)
- Optionally syncs to server
- Displays server stats if available

### Server-Side (traffic-api.php)
- Receives visit/tool usage data
- Stores in `traffic-data.json`
- Aggregates all visitors' stats
- Returns combined statistics

### Data Flow:
```
Visitor 1 → Uses tool → Sends to server → Server aggregates
Visitor 2 → Uses tool → Sends to server → Server aggregates
You → View stats → Gets combined stats from server
```

---

## ⚙️ Configuration

### Enable Server Sync

In `traffic-counter.js`, line 7:
```javascript
const TRAFFIC_API_URL = './traffic-api.php'; // Enabled
```

### Disable Server Sync (Local Only)

```javascript
const TRAFFIC_API_URL = null; // Disabled - local only
```

---

## 📁 Files Created

- `traffic-api.php` - Server endpoint
- `traffic-data.json` - Auto-created data file (don't upload this)

---

## 🔒 Security Notes

- ✅ CORS enabled (allows cross-origin requests)
- ✅ JSON file storage (simple, no database needed)
- ✅ Visitor IDs are anonymous
- ⚠️ File permissions: Make sure `traffic-data.json` is writable
- ⚠️ Consider rate limiting for production

---

## 🧪 Testing

### Test Server Endpoint

**Check if it works:**
```bash
curl http://your-server/CyberKit/traffic-api.php
```

Should return JSON with stats.

### Test from Browser

Open console and check:
```javascript
fetch('./traffic-api.php')
  .then(r => r.json())
  .then(console.log)
```

---

## 📈 What Gets Tracked

- **Total Visits** - All visitors combined
- **Unique Visits** - Unique visitor IDs
- **Tool Usage** - All tools used by all visitors
- **Daily Visits** - Visits per day
- **Top Tools** - Most popular tools across all users

---

## 🔄 Fallback Behavior

If server is unavailable:
- Falls back to local stats
- No errors shown to users
- Works offline (localStorage only)

---

## 📝 Next Steps

1. Upload `traffic-api.php` to server
2. Set file permissions
3. Test by visiting site
4. Check `traffic-data.json` is created
5. Stats should now show ALL visitors!

---

**After setup, all visitors' stats will be combined!** 🎉

