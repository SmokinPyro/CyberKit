# 🚀 CyberKit - Deployment Package

This folder contains **ALL** files needed for deployment.
- **Netlify**: Upload entire contents of this folder
- **Apache/PHP**: Upload all files (ignore `netlify/` folder)

## ✅ Files Included (Upload All of These)

```
deploy/
├── index.html              ← Main HTML file
├── app.obf.js              ← Obfuscated JavaScript (PROTECTED)
├── style.css               ← Stylesheet
├── .htaccess               ← Apache configuration (for PHP servers)
├── traffic-counter.js      ← Traffic counter (client-side)
├── traffic-api.php         ← PHP API (for Apache/PHP servers)
├── netlify.toml            ← Netlify configuration
├── netlify/
│   └── functions/
│       └── traffic-api.js ← Netlify Function (for Netlify hosting)
└── assets/
    └── images/
        └── cyberkit-logo.png
```

## 📋 Deployment Instructions

### For Netlify Hosting

1. **Upload entire `deploy/` folder contents to Netlify:**
   - Via Git: Push to connected repository
   - Via Drag & Drop: Upload entire folder to Netlify
   - Via CLI: `netlify deploy --dir=deploy`

2. **Netlify will automatically:**
   - Detect `netlify.toml` configuration
   - Deploy functions from `netlify/functions/`
   - Serve static files from root

3. **Test:**
   - Visit your Netlify site
   - Check function: `/.netlify/functions/traffic-api`
   - Open browser console to verify traffic counter works

### For Apache/PHP Server

1. **Upload files to Apache web root:**
   - `/var/www/html/CyberKit/` (Linux)
   - `C:\xampp\htdocs\CyberKit\` (Windows XAMPP)
   - **Ignore:** `netlify/` folder and `netlify.toml`

2. **Set Permissions (Linux):**
   ```bash
   chmod 644 index.html app.obf.js style.css .htaccess traffic-api.php
   chmod 755 assets/
   chmod 644 assets/images/cyberkit-logo.png
   ```

3. **Test:**
   - Visit: `http://your-server-ip/CyberKit/`
   - Check PHP API: `http://your-server/CyberKit/traffic-api.php`

## 🔒 Security Notes

- ✅ `app.obf.js` is obfuscated - source code is protected
- ✅ Original `app.js` is NOT included (kept local only)
- ✅ All tools run client-side (no server processing needed)

## 📝 What's NOT Included (Intentionally)

These files are kept in the main project folder for development:
- ❌ `app.js` - Original source code (keep local only!)
- ❌ `obfuscate-*.js` - Build scripts
- ❌ `*.md` - Documentation files
- ❌ `package.json` - Development dependencies
- ❌ `verify-setup.html` - Testing tools

## 🔄 Updating the Deployment

When you make changes:
1. Edit files in the main project folder
2. Re-obfuscate `app.js` → `app.obf.js`
3. Copy updated files to `deploy/` folder
4. **IMPORTANT:** Upload to server, but **DO NOT overwrite `traffic-data.json`**
   - This file contains all your traffic stats
   - It's created on the server, not in `deploy/` folder
   - See `DEPLOY-WITH-STATS-PRESERVATION.md` for details

### 📊 Preserving Traffic Stats

**Before uploading:**
- Backup `traffic-data.json` on server (optional)
- Upload only changed files, not the entire folder

**After uploading:**
- Verify `traffic-data.json` still exists on server
- Check that stats are still showing correctly

---

**Ready to deploy!** Just upload everything in this folder to your Apache server.

