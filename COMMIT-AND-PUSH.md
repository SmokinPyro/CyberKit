# 📝 How to Commit and Push After update-deploy.bat

## ✅ Step-by-Step Guide

### Step 1: Run Update Script
```bash
# Double-click or run in terminal:
update-deploy.bat
```

This syncs all your changes to the `deploy/` folder.

### Step 2: Check What Changed
```bash
# See what files were modified
git status
```

### Step 3: Add All Changes
```bash
# Add all changes (including deletions)
git add -A
```

Or add specific files:
```bash
git add deploy/
git add .gitignore
git add netlify.toml
```

### Step 4: Commit Changes
```bash
# Commit with a descriptive message
git commit -m "Fix: double counter bug, improve contact modal, clean up files"
```

**Good commit messages:**
- `"Fix: double counter bug"`
- `"Update: contact modal with copy button"`
- `"Clean: remove temporary files and organize codebase"`
- `"Fix: contact me button not working"`

### Step 5: Push to GitHub
```bash
# Push to master branch (triggers Netlify auto-deploy)
git push origin master
```

### Step 6: Verify Deployment
1. Check **Netlify Dashboard** → Deploys tab
2. Wait for deployment to complete (1-2 minutes)
3. Visit your site to verify changes

## 🚀 Quick Command (All in One)

```bash
# Run update script first
update-deploy.bat

# Then in Git Bash or PowerShell:
git add -A
git commit -m "Update: fix bugs and clean up"
git push origin master
```

## ⚠️ Important Notes

- **Always run `update-deploy.bat` first** to sync files
- **Check `git status`** before committing to see what changed
- **Write clear commit messages** so you know what each update does
- **Netlify auto-deploys** when you push to GitHub

## 🐛 If Something Goes Wrong

**Undo last commit (before pushing):**
```bash
git reset --soft HEAD~1
```

**Undo changes (discard local changes):**
```bash
git restore .
```

**Check what's different:**
```bash
git diff
```

---

**That's it!** Your changes will be live automatically. 🎉

