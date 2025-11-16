<?php
/**
 * Quick diagnostic tool for Traffic API
 * Upload this to your server and visit it to check if everything is working
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Traffic API Diagnostic</title>
    <style>
        body { font-family: monospace; background: #1a1a1a; color: #0f0; padding: 20px; }
        .success { color: #0f0; }
        .error { color: #f00; }
        .warning { color: #ff0; }
        .info { color: #0ff; }
        pre { background: #000; padding: 10px; border: 1px solid #333; overflow-x: auto; }
        h2 { border-bottom: 1px solid #333; padding-bottom: 5px; }
    </style>
</head>
<body>
    <h1>🔍 Traffic API Diagnostic Tool</h1>
    
    <?php
    echo "<h2>1. PHP Status</h2>";
    echo "<p class='success'>✅ PHP is working! Version: " . phpversion() . "</p>";
    
    echo "<h2>2. File Permissions</h2>";
    $dir = __DIR__;
    $dataFile = $dir . '/traffic-data.json';
    
    echo "<p class='info'>Directory: <code>$dir</code></p>";
    echo "<p class='info'>Data file: <code>$dataFile</code></p>";
    
    if (is_writable($dir)) {
        echo "<p class='success'>✅ Directory is writable</p>";
    } else {
        echo "<p class='error'>❌ Directory is NOT writable! Run: chmod 755 " . basename($dir) . "</p>";
    }
    
    if (file_exists($dataFile)) {
        echo "<p class='success'>✅ traffic-data.json exists</p>";
        if (is_writable($dataFile)) {
            echo "<p class='success'>✅ File is writable</p>";
        } else {
            echo "<p class='error'>❌ File is NOT writable! Run: chmod 666 traffic-data.json</p>";
        }
        echo "<p class='info'>File size: " . filesize($dataFile) . " bytes</p>";
        echo "<p class='info'>Last modified: " . date('Y-m-d H:i:s', filemtime($dataFile)) . "</p>";
    } else {
        echo "<p class='warning'>⚠️ traffic-data.json does not exist yet (will be created on first request)</p>";
    }
    
    echo "<h2>3. Test API Endpoint</h2>";
    $apiUrl = './traffic-api.php';
    echo "<p class='info'>Testing: <code>$apiUrl</code></p>";
    
    // Test GET
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => 'Content-Type: application/json'
        ]
    ]);
    
    $response = @file_get_contents($apiUrl, false, $context);
    if ($response !== false) {
        echo "<p class='success'>✅ GET request successful</p>";
        $data = json_decode($response, true);
        if ($data) {
            echo "<pre>" . json_encode($data, JSON_PRETTY_PRINT) . "</pre>";
        } else {
            echo "<p class='error'>❌ Invalid JSON response</p>";
            echo "<pre>$response</pre>";
        }
    } else {
        echo "<p class='error'>❌ GET request failed</p>";
    }
    
    // Test POST
    echo "<h2>4. Test POST Request</h2>";
    $postData = json_encode([
        'visitorId' => 'test_' . time(),
        'timestamp' => date('c')
    ]);
    
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => $postData
        ]
    ]);
    
    $response = @file_get_contents($apiUrl, false, $context);
    if ($response !== false) {
        echo "<p class='success'>✅ POST request successful</p>";
        $data = json_decode($response, true);
        if ($data) {
            echo "<pre>" . json_encode($data, JSON_PRETTY_PRINT) . "</pre>";
            
            // Check if file was updated
            if (file_exists($dataFile)) {
                clearstatcache();
                $newSize = filesize($dataFile);
                echo "<p class='info'>File size after POST: $newSize bytes</p>";
            }
        } else {
            echo "<p class='error'>❌ Invalid JSON response</p>";
            echo "<pre>$response</pre>";
        }
    } else {
        echo "<p class='error'>❌ POST request failed</p>";
    }
    
    echo "<h2>5. Current Stats</h2>";
    if (file_exists($dataFile)) {
        $content = file_get_contents($dataFile);
        $stats = json_decode($content, true);
        if ($stats) {
            echo "<pre>" . json_encode($stats, JSON_PRETTY_PRINT) . "</pre>";
        } else {
            echo "<p class='error'>❌ Could not parse JSON file</p>";
            echo "<pre>$content</pre>";
        }
    } else {
        echo "<p class='warning'>⚠️ No stats file yet</p>";
    }
    
    echo "<h2>6. Browser Test</h2>";
    echo "<p class='info'>Open browser console (F12) and run:</p>";
    echo "<pre>fetch('./traffic-api.php')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);</pre>";
    
    echo "<p class='info'>Or test POST:</p>";
    echo "<pre>fetch('./traffic-api.php', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    visitorId: 'test_browser_' + Date.now(),
    timestamp: new Date().toISOString()
  })
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);</pre>";
    ?>
    
    <hr>
    <p class='info'>If all tests pass, the API should be working. Check your browser console for errors when visiting the main site.</p>
</body>
</html>

