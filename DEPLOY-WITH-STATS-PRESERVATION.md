# 🔄 Preserving Traffic Stats During Deployment

## ⚠️ Important: Stats Preservation

The `traffic-data.json` file contains **ALL your traffic statistics**. This file is created on your **server**, not in the `deploy/` folder.

**You must preserve this file when updating your deployment!**

---

## 🛡️ How to Preserve Stats

### Method 1: Selective Upload (Recommended)

**Only upload changed files, NOT the entire folder:**

1. **Before deployment:**
   - Backup `traffic-data.json` on server (optional but recommended)
   
2. **Upload only these files:**
   - `index.html`
   - `app.obf.js`
   - `style.css`
   - `traffic-counter.js`
   - `traffic-api.php` (if updated)
   - `.htaccess` (if updated)
   - `assets/images/cyberkit-logo.png` (if updated)

3. **DO NOT upload/overwrite:**
   - ❌ `traffic-data.json` (keep existing on server)

### Method 2: Backup & Restore

**If you need to replace all files:**

1. **Before deployment:**
   ```bash
   # On server, backup the stats file
   cp traffic-data.json traffic-data.json.backup
   ```

2. **Upload all files** from `deploy/` folder

3. **After deployment:**
   ```bash
   # Restore the stats file
   cp traffic-data.json.backup traffic-data.json
   chmod 666 traffic-data.json  # Ensure it's writable
   ```

### Method 3: FTP/SFTP Selective Upload

**Using FileZilla or similar:**

1. Connect to server
2. Navigate to CyberKit directory
3. **Upload only changed files** (not `traffic-data.json`)
4. If `traffic-data.json` is selected, **deselect it** before uploading

---

## 📋 Safe Deployment Checklist

Before uploading:

- [ ] ✅ Backup `traffic-data.json` on server (optional but recommended)
- [ ] ✅ Upload only changed files
- [ ] ✅ Verify `traffic-data.json` still exists on server after upload
- [ ] ✅ Check file permissions: `chmod 666 traffic-data.json`
- [ ] ✅ Test that stats are still showing correctly

---

## 🔍 Where is traffic-data.json?

**Location on server:**
```
/var/www/html/CyberKit/traffic-data.json
```
or
```
C:\xampp\htdocs\CyberKit\traffic-data.json
```

**This file is:**
- ✅ Created automatically by `traffic-api.php`
- ✅ Stored on the server (not in `deploy/` folder)
- ✅ Contains all aggregated visitor stats
- ✅ Must be preserved during updates

---

## 🚨 What Happens If You Delete It?

If `traffic-data.json` is deleted:
- ❌ All traffic stats are lost
- ❌ Counter resets to zero
- ❌ Historical data is gone
- ✅ New stats will start accumulating from scratch

**The file will be recreated automatically**, but you'll lose all previous data.

---

## 💡 Best Practices

1. **Always backup before major updates**
2. **Use selective upload** (only changed files)
3. **Never delete** `traffic-data.json` intentionally
4. **Set proper permissions** so PHP can write to it
5. **Keep backups** of important stats milestones

---

## 🔧 Quick Commands

### Backup Stats (Linux)
```bash
cp traffic-data.json traffic-data.json.backup
```

### Restore Stats (Linux)
```bash
cp traffic-data.json.backup traffic-data.json
chmod 666 traffic-data.json
```

### Check Stats File (Linux)
```bash
ls -la traffic-data.json
cat traffic-data.json  # View contents
```

### Backup Stats (Windows)
```cmd
copy traffic-data.json traffic-data.json.backup
```

### Restore Stats (Windows)
```cmd
copy traffic-data.json.backup traffic-data.json
```

---

## 📝 Automated Backup Scripts

Use the provided scripts:
- `backup-stats.bat` (Windows)
- `backup-stats.ps1` (PowerShell)

Run these **on your server** before deploying updates.

---

## ✅ Verification After Deployment

1. Visit your site
2. Check the traffic counter widget
3. Verify stats are still showing (not reset to zero)
4. Use a tool to generate new activity
5. Confirm new activity is being tracked

If stats show zero, the `traffic-data.json` file was likely deleted or overwritten.

---

**Remember: `traffic-data.json` lives on your server, not in the `deploy/` folder!**

