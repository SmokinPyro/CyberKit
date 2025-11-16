# 🚀 Netlify Deployment - Two Options

## ⚠️ IMPORTANT: Choose ONE method based on how you're deploying

---

## Option 1: Deploy FROM `deploy/` Folder (Recommended)

**When to use:** Drag & drop the `deploy/` folder, or set base directory to `deploy` in Netlify

### Netlify Dashboard Settings:
- **Base directory:** `deploy`
- **Build command:** (leave empty)
- **Publish directory:** (leave empty - netlify.toml handles it)

### netlify.toml (already configured):
```toml
[build]
  publish = "."  # Current directory (the deploy/ folder)
```

### What this means:
- Netlify works from inside the `deploy/` folder
- `publish = "."` means "serve files from here"
- Functions are at `netlify/functions/` (relative to deploy/)

---

## Option 2: Deploy Entire Repo

**When to use:** Deploying the entire repository from root

### Netlify Dashboard Settings:
- **Base directory:** (leave empty)
- **Build command:** (leave empty)
- **Publish directory:** `deploy`

### netlify.toml (would need to change):
```toml
[build]
  publish = "deploy"  # Subdirectory from repo root
```

### What this means:
- Netlify works from repo root
- `publish = "deploy"` means "serve files from deploy/ subdirectory"
- Functions would need to be at `deploy/netlify/functions/`

---

## 🔍 How to Check Your Current Setup

1. **Go to Netlify Dashboard** → Your Site → Site Settings → Build & Deploy
2. **Check "Base directory":**
   - If it says `deploy` → Use **Option 1** (current netlify.toml is correct)
   - If it's empty → Use **Option 2** (need to change netlify.toml)

3. **Check your deployment method:**
   - **Drag & Drop:** Always use Option 1
   - **Git Integration:** Check base directory setting

---

## ✅ Current Configuration

The current `netlify.toml` is set for **Option 1** (deploying from deploy/ folder).

If you're using **Option 2** (entire repo), change `publish = "."` to `publish = "deploy"`.

---

## 🐛 Troubleshooting

**Error: "Build script returned non-zero exit code"**
- Make sure Build command is **empty** in Netlify dashboard
- Make sure `netlify.toml` has no `command =` line

**Error: "Publish directory does not exist"**
- Check if publish directory matches your setup (see options above)
- Verify files exist in the expected location

**Error: "Functions not found"**
- For Option 1: Functions should be at `deploy/netlify/functions/`
- For Option 2: Functions should be at `deploy/netlify/functions/` (same)

