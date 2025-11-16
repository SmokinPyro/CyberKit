# 🚀 Deploy to Netlify - Quick Guide

## ✅ What's in This Folder

This `deploy/` folder contains **everything** you need for Netlify:

- ✅ Static files (HTML, CSS, JS)
- ✅ Netlify Function (`netlify/functions/traffic-api.js`)
- ✅ Netlify config (`netlify.toml`)
- ✅ All assets

---

## 📤 How to Deploy

### Option 1: Drag & Drop (Easiest)

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Drag and drop this **entire `deploy/` folder** onto Netlify
3. Wait for deployment (1-2 minutes)
4. Done! ✅

### Option 2: Git (Recommended)

1. **Initialize Git in this folder** (if not already):
   ```bash
   cd deploy
   git init
   git add .
   git commit -m "Initial deploy"
   ```

2. **Connect to Netlify:**
   - Go to Netlify Dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Netlify will auto-deploy

### Option 3: Netlify CLI

```bash
cd deploy
netlify deploy --prod
```

---

## ✅ After Deployment

1. **Check Function:**
   - Visit: `https://your-site.netlify.app/.netlify/functions/traffic-api`
   - Should return JSON (not 404)

2. **Test Site:**
   - Visit your site
   - Open browser console (F12)
   - Look for: `Traffic API: Visit synced successfully`

3. **Verify in Dashboard:**
   - Netlify Dashboard → Functions tab
   - Should see `traffic-api` function listed

---

## 🔧 Configuration

The `netlify.toml` file is already configured:
- Functions directory: `netlify/functions`
- Publish directory: `.` (current folder)

**No changes needed!**

---

## 📋 Files Included

```
deploy/
├── index.html
├── app.obf.js
├── style.css
├── traffic-counter.js        ← Uses Netlify Functions
├── netlify.toml              ← Netlify config
├── netlify/
│   └── functions/
│       └── traffic-api.js    ← Serverless function
└── assets/
    └── images/
        └── cyberkit-logo.png
```

---

## ⚠️ Important Notes

1. **Upload entire folder contents** - Don't upload the `deploy/` folder itself, upload its contents
2. **Function deploys automatically** - Netlify detects `netlify/functions/`
3. **Data is temporary** - Functions use `/tmp` (resets on cold start)
4. **Free tier limits** - 125,000 requests/month (plenty for testing)

---

## 🆘 Troubleshooting

### Function not found (404)
- ✅ Check `netlify/functions/traffic-api.js` exists
- ✅ Redeploy site
- ✅ Check Netlify deploy logs

### Stats not updating
- ✅ Test function: `/.netlify/functions/traffic-api`
- ✅ Check browser console for errors
- ✅ Verify function is deployed (Functions tab)

---

**That's it! Just upload this folder to Netlify!** 🎉

