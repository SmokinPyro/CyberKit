# 🚀 CyberKit Quick Start Guide

## 📂 Folder Organization

Your project is now organized into two sections:

### 🔒 **Main Folder** (Keep Local - Development)
Contains source code and development files:
- `app.js` - **Original source code** (DO NOT DELETE!)
- `app.obf.js` - Obfuscated version (backup)
- `index.html` - Development version
- `style.css` - Development version
- `assets/` - Development assets
- Build scripts, documentation, etc.

### 🚀 **deploy/ Folder** (Upload to Server)
Contains **ONLY** production-ready files:
- `index.html` - Main page
- `app.obf.js` - **Obfuscated** JavaScript (protected)
- `style.css` - Stylesheet
- `.htaccess` - Apache configuration
- `assets/images/cyberkit-logo.png` - Logo

## ✅ What to Upload to Apache

**Upload EVERYTHING in the `deploy/` folder to your Apache server.**

That's it! Just upload the entire `deploy/` folder contents.

## 🔄 When You Make Changes

1. Edit files in the **main folder**
2. Re-obfuscate: `app.js` → `app.obf.js`
3. Run update script:
   - Windows: Double-click `update-deploy.bat`
   - Or PowerShell: `.\update-deploy.ps1`
4. Upload `deploy/` folder to server

## 🔒 Security

- ✅ Source code (`app.js`) stays on your computer
- ✅ Only obfuscated code (`app.obf.js`) goes to server
- ✅ Your code is protected!

## 📋 Quick Checklist

Before deploying:
- [ ] `deploy/app.obf.js` exists
- [ ] `deploy/index.html` references `app.obf.js`
- [ ] `deploy/assets/images/cyberkit-logo.png` exists
- [ ] `app.js` is NOT in deploy folder

---

**Ready to deploy!** Upload the `deploy/` folder to your Apache server.

