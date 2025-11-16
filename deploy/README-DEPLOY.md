# 🚀 CyberKit - Server Deployment Package

This folder contains **ONLY** the files needed for Apache server deployment.

## ✅ Files Included (Upload All of These)

```
deploy/
├── index.html              ← Main HTML file
├── app.obf.js              ← Obfuscated JavaScript (PROTECTED)
├── style.css               ← Stylesheet
├── .htaccess               ← Apache configuration
└── assets/
    └── images/
        └── cyberkit-logo.png
```

## 📋 Deployment Instructions

### Step 1: Upload to Apache Server
Upload **ALL files** from this `deploy/` folder to your Apache web root:
- `/var/www/html/CyberKit/` (Linux)
- `C:\xampp\htdocs\CyberKit\` (Windows XAMPP)
- Or your custom web directory

### Step 2: Set Permissions (Linux)
```bash
chmod 644 index.html app.obf.js style.css .htaccess
chmod 755 assets/
chmod 644 assets/images/cyberkit-logo.png
```

### Step 3: Test
Visit: `http://your-server-ip/CyberKit/` or `http://your-domain/CyberKit/`

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
4. Upload to server

---

**Ready to deploy!** Just upload everything in this folder to your Apache server.

