# 🚀 Deployment Instructions

## Quick Deploy Steps

### 1. Update Deploy Folder
```bash
# Run the update script
update-deploy.bat
```

This will:
- Copy all updated files to `deploy/` folder
- Remove source code (`app.js`) from deploy
- Remove `traffic-data.json` (server-only file)
- Keep everything organized

### 2. Commit Changes
```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "Update: fix double counter bug, improve contact modal, clean up files"

# Push to GitHub (triggers Netlify auto-deploy)
git push origin master
```

### 3. Verify Deployment
- Check Netlify dashboard for deployment status
- Visit your site to verify changes
- Test Contact Me button
- Verify only one traffic counter appears

## 📋 What Gets Deployed

The `deploy/` folder contains:
- ✅ `index.html` - Main page
- ✅ `app.obf.js` - Obfuscated JavaScript
- ✅ `style.css` - Styles
- ✅ `traffic-counter.js` - Traffic counter
- ✅ `netlify.toml` - Netlify configuration
- ✅ `netlify/functions/traffic-api.js` - Serverless function
- ✅ `assets/` - Images and resources

## ⚠️ Important Notes

- **Never commit `app.js`** to deploy folder (source code protection)
- **Never commit `traffic-data.json`** (server-only, created on server)
- **Always run `update-deploy.bat`** before committing
- **Test locally** before pushing to production

## 🔄 Update Workflow

1. Make changes to source files
2. Re-obfuscate if needed: `npm run obfuscate`
3. Run `update-deploy.bat`
4. Test locally in `deploy/` folder
5. Commit and push
6. Netlify auto-deploys

---

**That's it!** Your changes will be live on Netlify automatically. 🎉

