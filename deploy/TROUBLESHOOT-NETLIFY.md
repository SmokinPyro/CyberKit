# 🔧 Netlify Troubleshooting Guide

## ❌ Common Error: "Build script returned non-zero exit code: 2"

This happens when Netlify tries to run a build command, but this is a **static site** with no build process.

---

## ✅ Quick Fix

### Step 1: Check Netlify Dashboard Settings

Go to: **Site Settings → Build & Deploy → Continuous Deployment**

**If deploying FROM `deploy/` folder (drag & drop or base directory = `deploy`):**
- ✅ **Base directory:** `deploy`
- ✅ **Build command:** (leave **completely empty** - delete any value)
- ✅ **Publish directory:** (leave **completely empty** - netlify.toml handles it)

**If deploying entire repo (base directory empty):**
- ✅ **Base directory:** (empty)
- ✅ **Build command:** (leave **completely empty**)
- ✅ **Publish directory:** `deploy`

### Step 2: Verify netlify.toml

The `deploy/netlify.toml` should have:

```toml
[build]
  # No command line = no build step
  publish = "."  # For deploying FROM deploy/ folder
```

OR if deploying entire repo:

```toml
[build]
  publish = "deploy"  # For deploying entire repo
```

---

## 🔍 How to Get Full Error Logs

1. **In Netlify Dashboard:**
   - Go to **Deploys** tab
   - Click on the **failed deploy**
   - Click **"Show all"** or **"Download deploy log"**
   - Copy the **last 50-100 lines** that show the actual error

2. **Enable Debug Mode:**
   - Go to **Site Settings → Build & Deploy → Environment**
   - Add variable: `NETLIFY_BUILD_DEBUG` = `true`
   - Trigger a new deploy
   - Check logs again (will be more verbose)

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot find module" or "npm run build failed"

**Cause:** Netlify is trying to run `npm run build` from `package.json`

**Fix:**
1. Go to Netlify Dashboard → Build settings
2. **Delete** the Build command field (make it empty)
3. Save and redeploy

### Issue 2: "Publish directory does not exist"

**Cause:** Wrong publish directory in netlify.toml or dashboard

**Fix:**
- If deploying FROM `deploy/` folder: `publish = "."`
- If deploying entire repo: `publish = "deploy"`
- Make sure dashboard settings match

### Issue 3: "Functions not found"

**Cause:** Functions directory path is wrong

**Fix:**
- In `netlify.toml`, functions directory should be: `netlify/functions`
- Make sure `netlify/functions/traffic-api.js` exists in deploy folder

---

## 📋 Checklist Before Redeploying

- [ ] Build command is **empty** in Netlify dashboard
- [ ] `netlify.toml` has no `command =` line (or it's commented out)
- [ ] Publish directory matches your deployment method
- [ ] All files are committed and pushed (if using Git)
- [ ] `netlify/functions/traffic-api.js` exists in deploy folder

---

## 🚀 After Fixing

1. **Commit changes** (if using Git)
2. **Trigger new deploy** in Netlify
3. **Check deploy log** - should show "No build command specified, skipping build"
4. **Test site** - should load without errors

---

## 💬 Still Having Issues?

**Please provide:**
1. Full deploy log (last 50-100 lines with actual error)
2. Your Netlify dashboard settings (Base directory, Build command, Publish directory)
3. How you're deploying (Drag & drop, Git, CLI)

With this info, I can give you an exact fix! 🎯

