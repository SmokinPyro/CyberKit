# 📊 Traffic Counter System

## Overview

A comprehensive traffic counter that tracks visits and tool usage, displayed in a green glowing widget in the bottom-right corner.

## Features

### 📈 Tracks:
- **Total Visits** - All page loads
- **Unique Visits** - First-time visitors (using localStorage)
- **Today's Visits** - Daily visit count
- **Tool Usage** - Counts each tool button click
- **Top Tools** - Shows most used tools

### 🎨 Widget Features:
- **Green glowing effect** - Subtle pulsing glow animation
- **Draggable** - Click and drag to reposition
- **Collapsible** - Click `−` to minimize
- **Small font** - Compact design, doesn't interfere
- **Bottom-right** - Positioned in corner (can be moved)

## How It Works

### Data Storage
- Uses **localStorage** (client-side only)
- Data persists across sessions
- Each visitor gets a unique ID
- No server required - fully client-side

### Tracking
- Automatically tracks page visits
- Monitors all tool button clicks
- Updates in real-time
- Shows top 5 most used tools

## Viewing Detailed Stats

Open browser console (F12) and type:
```javascript
getTrafficData()
```

This returns:
- Total visits
- Unique visits
- Tool usage breakdown
- Daily visit history
- First/last visit timestamps

## Widget Display

The widget shows:
```
📊 Stats [−]
─────────────
Visits:    1,234
Unique:      567
Today:        12
Tools Used: 3,456
─────────────
Top Tools:
Password Gen   234
Base64 Encode  189
SHA-256 Hash   156
...
```

## Customization

### Change Position
- Drag the widget to any corner
- Position is saved in localStorage

### Change Visibility
- Click `−` to collapse
- Click `+` to expand

### Access Full Data
- Use `getTrafficData()` in console
- Export data for analysis

## Privacy

- ✅ All data stored locally (browser)
- ✅ No external tracking
- ✅ No cookies
- ✅ No server communication
- ✅ User can clear data anytime (clear browser data)

## Files Added

- `traffic-counter.js` - Main counter logic
- Updated `app.js` - Initializes counter
- Updated `index.html` - Includes counter script
- Updated `style.css` - Widget styling

## Notes

- Data is per-browser (not synced across devices)
- Clearing browser data resets stats
- Works offline (no server needed)
- Stats visible to site visitors (optional - can be hidden)

---

**The widget appears automatically in the bottom-right corner!**

