# 🔧 Netlify Deployment Fix

## Problem
Netlify was trying to run a build command, but this is a static site with no build process.

## ✅ Solution Applied
Updated `deploy/netlify.toml` to:
- **Removed** the build command entirely (no `command` line = no build step)
- Set publish directory to current directory (`publish = "."`)
- This tells Netlify: "This is a static site, just serve the files"

## 📋 Netlify Settings to Verify

### In Netlify Dashboard → Site Settings → Build & Deploy:

**IMPORTANT:** If you're deploying from Git and the repo has a `package.json` in the root, you MUST configure these settings:

1. **Base directory:** Set to `deploy` (this tells Netlify to work from the deploy folder)
2. **Build command:** Leave **completely empty** (or delete the field)
3. **Publish directory:** Leave **completely empty** (netlify.toml will handle it)

### If Deploying from Git:

**Recommended: Deploy from `deploy/` folder**
- Base directory: `deploy`
- Build command: (empty/delete field)
- Publish directory: (empty/delete field)

**Alternative: Deploy entire repo**
- Base directory: (empty)
- Build command: (empty/delete field)
- Publish directory: `deploy`

### If Using Drag & Drop:
- Just drag the entire `deploy/` folder
- Netlify will use `netlify.toml` automatically

## 🚀 After Fix

1. **Commit and push** the updated `netlify.toml`
2. **Trigger a new deploy** in Netlify
3. **Check deploy logs** - should show "No build command specified, skipping build"

## ✅ Expected Behavior

- ✅ No build errors
- ✅ Static files served directly
- ✅ Netlify Functions work (traffic-api.js)
- ✅ Site loads correctly

## 🐛 If Still Failing

1. Check Netlify dashboard → Deploys → [latest deploy] → View deploy log
2. Look for the actual error message (before "exit code 2")
3. Verify `netlify.toml` is in the root of what you're deploying
4. Make sure `netlify/functions/traffic-api.js` exists

