# 🚀 Enable GitHub Pages - Step by Step

## ⚠️ Current Issue

Your GitHub Pages is set to **"Deploy from a branch"** with **"/ (root)"** directory, but your files are in the **`deploy/`** folder.

## ✅ Solution: Switch to GitHub Actions

### Step 1: Change Source
1. On the GitHub Pages settings page you're viewing
2. Find the **"Source"** dropdown (currently shows "Deploy from a branch")
3. Click the dropdown
4. Select **"GitHub Actions"** from the list
5. Click **"Save"**

### Step 2: Verify Workflow Runs
1. Go to: https://github.com/SmokinPyro/CyberKit/actions
2. You should see "Deploy to GitHub Pages" workflow
3. It should run automatically and deploy from `deploy/` folder

### Step 3: Wait for Deployment
- Takes 1-2 minutes
- Check the Actions tab to see progress
- When green checkmark appears, your site is live!

---

## 🌐 Your Site URL

After deployment, your site will be live at:
**`https://smokinpyro.github.io/CyberKit`**

---

## 🔄 Alternative: If You Want to Use "Deploy from a branch"

If you prefer to use "Deploy from a branch" instead:

1. Keep "Deploy from a branch" selected
2. Change the directory from **"/ (root)"** to **"/deploy"**
3. Click **"Save"**

But **GitHub Actions is recommended** because:
- ✅ Automatically deploys on every push
- ✅ More reliable
- ✅ Better for CI/CD

---

**Just change the Source dropdown to "GitHub Actions" and click Save!** 🎉

