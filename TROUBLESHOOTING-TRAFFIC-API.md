# 🔧 Troubleshooting Traffic API

If your friend's visits aren't showing up, follow these steps:

## ✅ Step 1: Verify PHP File is Uploaded

**Check on your server:**
- Is `traffic-api.php` in the same directory as `index.html`?
- File path should be: `/var/www/html/CyberKit/traffic-api.php` (or your server path)

**Quick test:**
Visit: `http://your-server/CyberKit/traffic-api.php`

**Expected result:**
Should return JSON like:
```json
{
  "totalVisits": 0,
  "uniqueVisits": 0,
  "todayVisits": 0,
  ...
}
```

**If you get 404:**
- File is not uploaded
- Upload `traffic-api.php` to your server

**If you get blank page or download:**
- PHP is not enabled on your server
- Contact your hosting provider

---

## ✅ Step 2: Check File Permissions

**On Linux server:**
```bash
cd /var/www/html/CyberKit
ls -la traffic-api.php
```

**Should show:**
```
-rw-r--r-- 1 www-data www-data ... traffic-api.php
```

**If permissions are wrong:**
```bash
chmod 644 traffic-api.php
```

**Check if directory is writable:**
```bash
ls -ld .
chmod 755 .
```

---

## ✅ Step 3: Test with Diagnostic Tool

1. Upload `test-traffic-api.html` to your server
2. Visit: `http://your-server/CyberKit/test-traffic-api.html`
3. Click all test buttons
4. Check results

**What to look for:**
- ✅ All tests pass = Everything works!
- ❌ File test fails = PHP file not uploaded
- ❌ GET test fails = PHP not processing correctly
- ❌ POST test fails = Write permissions issue

---

## ✅ Step 4: Check Browser Console

**On your site:**
1. Press F12 (open developer tools)
2. Go to "Console" tab
3. Look for messages starting with "Traffic API:"

**Good messages:**
```
Traffic API: Loaded server stats successfully
```

**Bad messages:**
```
Traffic API: Server unavailable, using local stats
Traffic API: Failed to sync visit to server
```

**If you see errors:**
- Check if `traffic-api.php` is uploaded
- Check server error logs
- Verify PHP is enabled

---

## ✅ Step 5: Check traffic-data.json

**On your server:**
```bash
cd /var/www/html/CyberKit
ls -la traffic-data.json
cat traffic-data.json
```

**If file doesn't exist:**
- PHP might not have write permissions
- Check directory permissions: `chmod 755 .`
- Try creating manually: `touch traffic-data.json && chmod 666 traffic-data.json`

**If file exists but is empty:**
- Check PHP error logs
- Verify PHP can write to directory

---

## ✅ Step 6: Test Manually

**Test POST request from browser console:**
```javascript
fetch('./traffic-api.php', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    visitorId: 'test_123',
    timestamp: new Date().toISOString()
  })
}).then(r => r.json()).then(console.log)
```

**Expected:**
```json
{
  "success": true,
  "totalVisits": 1,
  "uniqueVisits": 1
}
```

**Test GET request:**
```javascript
fetch('./traffic-api.php').then(r => r.json()).then(console.log)
```

---

## 🔍 Common Issues

### Issue 1: "404 Not Found"
**Problem:** `traffic-api.php` not uploaded
**Solution:** Upload the file to your server

### Issue 2: "500 Internal Server Error"
**Problem:** PHP error or permission issue
**Solution:** 
- Check PHP error logs
- Verify file permissions
- Check directory is writable

### Issue 3: "Blank page when accessing PHP file"
**Problem:** PHP not enabled
**Solution:** Contact hosting provider to enable PHP

### Issue 4: "Stats show but don't update"
**Problem:** Write permissions
**Solution:**
```bash
chmod 666 traffic-data.json
chmod 755 /path/to/CyberKit/
```

### Issue 5: "Only my visits show, not friend's"
**Problem:** Server sync not working
**Solution:**
- Verify `traffic-api.php` is on server
- Check browser console for errors
- Test with diagnostic tool

---

## 📋 Checklist

Before asking for help, verify:

- [ ] `traffic-api.php` is uploaded to server
- [ ] File is in same directory as `index.html`
- [ ] PHP is enabled on server
- [ ] File permissions are correct (644)
- [ ] Directory is writable (755)
- [ ] `traffic-data.json` can be created/written
- [ ] Browser console shows no errors
- [ ] Diagnostic tool tests pass

---

## 🆘 Still Not Working?

1. **Check server error logs:**
   ```bash
   tail -f /var/log/apache2/error.log
   # or
   tail -f /var/log/nginx/error.log
   ```

2. **Test PHP directly:**
   Create `test.php`:
   ```php
   <?php phpinfo(); ?>
   ```
   Visit it - should show PHP info page

3. **Check if JSON file is being created:**
   ```bash
   ls -la traffic-data.json
   cat traffic-data.json
   ```

4. **Verify CORS (if accessing from different domain):**
   - Check browser console for CORS errors

---

**Most common issue:** `traffic-api.php` is not uploaded to the server! Make sure it's in the same directory as your `index.html`.

