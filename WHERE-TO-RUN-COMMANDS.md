# 📍 Where to Run Commands

## ✅ Current Location

You should run all commands from the **CyberKit project root folder**:

```
C:\Users\Pyro\Desktop\CyberKit\
```

This is where you'll find:
- `update-deploy.bat` ✅
- `app.js` ✅
- `index.html` ✅
- `deploy/` folder ✅
- `.git/` folder ✅

## 🚀 Step-by-Step Instructions

### Option 1: Using Windows File Explorer (Easiest)

1. **Open File Explorer**
2. **Navigate to:** `C:\Users\Pyro\Desktop\CyberKit`
3. **Double-click:** `update-deploy.bat`
   - This runs the script automatically
   - A window will open showing the progress
   - Press any key when it says "Press any key to continue..."

4. **Then open Git Bash or PowerShell:**
   - Right-click in the folder → "Git Bash Here" (if installed)
   - OR Right-click in the folder → "Open PowerShell window here"
   - OR Open PowerShell and type: `cd C:\Users\Pyro\Desktop\CyberKit`

5. **Run these commands:**
   ```bash
   git add -A
   git commit -m "Update: fix bugs and clean up files"
   git push origin master
   ```

### Option 2: Using PowerShell (Current Terminal)

If you're already in PowerShell in the CyberKit folder:

1. **Run update script:**
   ```powershell
   .\update-deploy.bat
   ```

2. **Then run Git commands:**
   ```powershell
   git add -A
   git commit -m "Update: fix bugs and clean up files"
   git push origin master
   ```

### Option 3: Using Command Prompt (CMD)

1. **Open Command Prompt**
2. **Navigate to project:**
   ```cmd
   cd C:\Users\Pyro\Desktop\CyberKit
   ```

3. **Run update script:**
   ```cmd
   update-deploy.bat
   ```

4. **Then run Git commands:**
   ```cmd
   git add -A
   git commit -m "Update: fix bugs and clean up files"
   git push origin master
   ```

## ✅ Verify You're in the Right Place

Run this command to check:
```powershell
# PowerShell
Get-Location
# Should show: C:\Users\Pyro\Desktop\CyberKit

# Or check if files exist:
Test-Path update-deploy.bat
Test-Path deploy
Test-Path .git
# All should return: True
```

## 📋 Quick Checklist

- [ ] You're in `C:\Users\Pyro\Desktop\CyberKit` folder
- [ ] You can see `update-deploy.bat` file
- [ ] You can see `deploy/` folder
- [ ] Git is installed and configured
- [ ] You're connected to GitHub

## 🎯 Summary

**Run everything from:** `C:\Users\Pyro\Desktop\CyberKit`

**Order:**
1. `update-deploy.bat` (double-click or run in terminal)
2. `git add -A` (in terminal)
3. `git commit -m "message"` (in terminal)
4. `git push origin master` (in terminal)

---

**That's it!** All commands run from the same folder. 🚀

