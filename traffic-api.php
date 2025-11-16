<?php
/**
 * CyberKit Traffic Counter API
 * Simple server-side tracking endpoint
 * 
 * Stores traffic data in a JSON file
 * 
 * Usage:
 * - POST: Send visit/tool usage data
 * - GET: Retrieve aggregated stats
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Data file location - MUST be preserved during deployments!
$dataFile = __DIR__ . '/traffic-data.json';

// Initialize data structure
$defaultData = [
    'totalVisits' => 0,
    'uniqueVisits' => 0,
    'toolUsage' => [],
    'dailyVisits' => [],
    'firstVisit' => null,
    'lastVisit' => null,
    'visitors' => []
];

// Load existing data
if (file_exists($dataFile)) {
    $fileContent = @file_get_contents($dataFile);
    if ($fileContent !== false) {
        $data = json_decode($fileContent, true);
        if (!$data || !is_array($data)) {
            // Invalid JSON, reset to default
            $data = $defaultData;
        }
    } else {
        // Could not read file
        $data = $defaultData;
    }
} else {
    $data = $defaultData;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle POST - record visit/usage
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }
    
    $now = date('Y-m-d\TH:i:s\Z');
    $today = date('Y-m-d');
    $visitorId = $input['visitorId'] ?? 'unknown_' . time();
    
    // Check if new unique visitor
    $isNewVisitor = !in_array($visitorId, $data['visitors']);
    if ($isNewVisitor) {
        $data['uniqueVisits']++;
        $data['visitors'][] = $visitorId;
        // Keep only last 1000 visitor IDs to prevent file bloat
        if (count($data['visitors']) > 1000) {
            $data['visitors'] = array_slice($data['visitors'], -1000);
        }
    }
    
    // Total visits
    $data['totalVisits']++;
    
    // First visit
    if (!$data['firstVisit']) {
        $data['firstVisit'] = $now;
    }
    
    // Last visit
    $data['lastVisit'] = $now;
    
    // Daily visits
    if (!isset($data['dailyVisits'][$today])) {
        $data['dailyVisits'][$today] = 0;
    }
    $data['dailyVisits'][$today]++;
    
    // Tool usage
    if (isset($input['toolName'])) {
        $toolName = $input['toolName'];
        if (!isset($data['toolUsage'][$toolName])) {
            $data['toolUsage'][$toolName] = 0;
        }
        $data['toolUsage'][$toolName]++;
    }
    
    // Save data
    $result = @file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
    
    if ($result === false) {
        // Log error but don't fail the request
        error_log('Failed to write traffic-data.json. Check file permissions.');
    }
    
    // Return success
    echo json_encode([
        'success' => true,
        'totalVisits' => $data['totalVisits'],
        'uniqueVisits' => $data['uniqueVisits']
    ]);
    
} else {
    // Handle GET - return stats
    // Calculate today's visits
    $today = date('Y-m-d');
    $todayVisits = $data['dailyVisits'][$today] ?? 0;
    
    // Sort tool usage
    $toolUsageSorted = $data['toolUsage'];
    arsort($toolUsageSorted);
    $topTools = array_slice($toolUsageSorted, 0, 5, true);
    
    echo json_encode([
        'totalVisits' => $data['totalVisits'],
        'uniqueVisits' => $data['uniqueVisits'],
        'todayVisits' => $todayVisits,
        'toolUsage' => $data['toolUsage'],
        'topTools' => $topTools,
        'firstVisit' => $data['firstVisit'],
        'lastVisit' => $data['lastVisit']
    ], JSON_PRETTY_PRINT);
}
?>

