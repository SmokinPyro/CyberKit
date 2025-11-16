# 📦 CyberKit Deployment Guide

## Folder Structure

```
CyberKit/
├── deploy/              ← 🚀 UPLOAD THIS FOLDER TO SERVER
│   ├── index.html
│   ├── app.obf.js      (obfuscated)
│   ├── style.css
│   ├── .htaccess
│   └── assets/
│       └── images/
│           └── cyberkit-logo.png
│
├── app.js              ← 🔒 KEEP LOCAL (source code)
├── app.obf.js          ← 🔒 KEEP LOCAL (backup)
├── index.html           ← 🔒 KEEP LOCAL (development)
├── style.css            ← 🔒 KEEP LOCAL (development)
├── assets/              ← 🔒 KEEP LOCAL (development)
└── [other dev files]    ← 🔒 KEEP LOCAL
```

## 📂 What Goes Where

### ✅ Upload to Apache Server (`deploy/` folder)
**These files are safe to upload - no source code exposed:**
- `index.html` - Main page
- `app.obf.js` - **Obfuscated** JavaScript (protected)
- `style.css` - Stylesheet
- `.htaccess` - Apache config
- `assets/images/cyberkit-logo.png` - Logo

### 🔒 Keep Local Only (Main folder)
**These files contain source code - DO NOT upload:**
- `app.js` - **Original source code** (keep this!)
- `obfuscate-*.js` - Build scripts
- `*.md` - Documentation
- `package.json` - Dev dependencies
- `verify-setup.html` - Testing tools

## 🚀 Quick Deployment Steps

### Option 1: Manual Upload
1. Open `deploy/` folder
2. Select ALL files and folders
3. Upload to Apache web directory via FTP/SFTP/File Manager
4. Done!

### Option 2: Using Command Line (Linux)
```bash
# From project root
scp -r deploy/* user@server:/var/www/html/CyberKit/
```

### Option 3: Using File Manager
1. Access your server's file manager (cPanel, Plesk, etc.)
2. Navigate to web root directory
3. Upload all contents of `deploy/` folder

## 🔄 Updating Your Deployment

When you make changes to your code:

1. **Edit source files** in main project folder
2. **Re-obfuscate** `app.js` → `app.obf.js`
3. **Copy updated files** to `deploy/` folder:
   ```bash
   copy index.html deploy\index.html
   copy app.obf.js deploy\app.obf.js
   copy style.css deploy\style.css
   ```
4. **Upload** `deploy/` folder to server

## 📋 Deployment Checklist

Before uploading, verify:
- [ ] `deploy/app.obf.js` exists (obfuscated)
- [ ] `deploy/index.html` references `app.obf.js` (not `app.js`)
- [ ] `deploy/assets/images/cyberkit-logo.png` exists
- [ ] `deploy/.htaccess` exists
- [ ] `app.js` is NOT in deploy folder (source code protected)

## 🔒 Security Reminders

- ✅ **Always** upload from `deploy/` folder
- ✅ **Never** upload `app.js` to server
- ✅ **Keep** `app.js` as backup on your computer
- ✅ **Test** locally before deploying

## 📝 File Comparison

| File | Location | Purpose |
|------|-----------|----------|
| `app.js` | Main folder | Source code (development) |
| `app.obf.js` | Both folders | Obfuscated (production) |
| `index.html` | Both folders | Main page |
| `style.css` | Both folders | Stylesheet |
| `.htaccess` | Deploy folder | Server config |

---

**Your source code is safe!** Only the obfuscated version goes to the server.

