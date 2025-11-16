/**
 * CyberKit Traffic Counter
 * Tracks visits and tool usage using localStorage
 * Optionally syncs with server for shared stats across all visitors
 */

// Server API endpoint (set to null to disable server sync)
// For Netlify: use '/.netlify/functions/traffic-api'
// For PHP server: use './traffic-api.php'
// For GitHub Pages: use JSONBin.io free API for global stats
// Get your free API key from https://jsonbin.io and replace YOUR_API_KEY below
const TRAFFIC_API_URL = 'https://api.jsonbin.io/v3/b/6919755643b1c97be9b08a53'; // JSONBin.io bin ID for global stats
const TRAFFIC_API_KEY = '$2a$10$R0dXsPxy7xybloqSE7JMOerAsO.bI3Y60q7etpX.j/AWRCXNAho0a'; // JSONBin.io API key
const USE_JSONBIN = true; // Global stats enabled

// Traffic counter data structure
let trafficData = {
  totalVisits: 0,
  uniqueVisits: 0,
  sessionVisits: 0,
  toolUsage: {},
  firstVisit: null,
  lastVisit: null,
  dailyVisits: {}
};

// Tool names mapping
const toolNames = {
  'pw-generate-btn': 'Password Generator',
  'token-generate-btn': 'Token Generator',
  'b64-encode-btn': 'Base64 Encode',
  'b64-decode-btn': 'Base64 Decode',
  'b64u-encode-btn': 'Base64URL Encode',
  'b64u-decode-btn': 'Base64URL Decode',
  'b32-encode-btn': 'Base32 Encode',
  'b32-decode-btn': 'Base32 Decode',
  'sha-generate-btn': 'SHA-256 Hash',
  'mh-generate-btn': 'Multi-Hash',
  'hex-to-text-btn': 'Hex to Text',
  'text-to-hex-btn': 'Text to Hex',
  'url-encode-btn': 'URL Encode',
  'url-decode-btn': 'URL Decode',
  'client-refresh-btn': 'Client Info',
  'ip-lookup-btn': 'IP Lookup',
  'cidr-calc-btn': 'CIDR Calculator',
  'ts-to-date-btn': 'Timestamp Converter',
  'date-to-ts-btn': 'Date to Timestamp',
  'cipher-rot13-btn': 'ROT13 Cipher',
  'cipher-encode-btn': 'Caesar Encode',
  'cipher-decode-btn': 'Caesar Decode',
  'jwt-decode-btn': 'JWT Decoder'
};

// Initialize traffic counter
let trafficCounterInitialized = false;

function initTrafficCounter() {
  // Prevent double initialization
  if (trafficCounterInitialized) {
    console.debug('Traffic counter already initialized, skipping...');
    return;
  }
  trafficCounterInitialized = true;
  
  // Load existing data
  loadTrafficData();
  
  // Record visit
  recordVisit();
  
  // Initialize widget
  initTrafficWidget();
  
  // Track tool usage
  trackToolUsage();
  
  // Update widget display (async - loads server stats if available)
  updateTrafficWidget();
  
  // Refresh stats from server periodically (every 30 seconds)
  if (TRAFFIC_API_URL) {
    setInterval(() => {
      updateTrafficWidget();
    }, 30000);
  }
}

// Load traffic data from localStorage (PRIMARY storage)
function loadTrafficData() {
  try {
    const saved = localStorage.getItem('cyberkit_traffic');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all required fields exist
      trafficData = {
        totalVisits: parsed.totalVisits || 0,
        uniqueVisits: parsed.uniqueVisits || 0,
        sessionVisits: parsed.sessionVisits || 0,
        toolUsage: parsed.toolUsage || {},
        firstVisit: parsed.firstVisit || null,
        lastVisit: parsed.lastVisit || null,
        dailyVisits: parsed.dailyVisits || {}
      };
      console.debug('Traffic data loaded from localStorage:', {
        totalVisits: trafficData.totalVisits,
        uniqueVisits: trafficData.uniqueVisits
      });
    } else {
      console.debug('No existing traffic data found, starting fresh');
    }
  } catch (e) {
    console.warn('Failed to load traffic data:', e);
    // Reset to defaults on error
    trafficData = {
      totalVisits: 0,
      uniqueVisits: 0,
      sessionVisits: 0,
      toolUsage: {},
      firstVisit: null,
      lastVisit: null,
      dailyVisits: {}
    };
  }
}

// Save traffic data to localStorage (PRIMARY storage - persists across sessions)
function saveTrafficData() {
  try {
    localStorage.setItem('cyberkit_traffic', JSON.stringify(trafficData));
    console.debug('Traffic data saved to localStorage');
  } catch (e) {
    console.error('Failed to save traffic data:', e);
    // If localStorage is full, try to clean old data
    if (e.name === 'QuotaExceededError') {
      console.warn('localStorage full, attempting cleanup...');
      try {
        // Keep only last 30 days of daily visits
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const cutoff = thirtyDaysAgo.toISOString().split('T')[0];
        Object.keys(trafficData.dailyVisits).forEach(date => {
          if (date < cutoff) {
            delete trafficData.dailyVisits[date];
          }
        });
        localStorage.setItem('cyberkit_traffic', JSON.stringify(trafficData));
        console.info('Cleaned old data and saved successfully');
      } catch (cleanupError) {
        console.error('Cleanup failed:', cleanupError);
      }
    }
  }
}

// Record a visit
function recordVisit() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const visitorId = getVisitorId();
  
  // Check if this is a new unique visitor
  const uniqueKey = 'cyberkit_unique_' + visitorId;
  const isNewVisitor = !localStorage.getItem(uniqueKey);
  
  if (isNewVisitor) {
    trafficData.uniqueVisits++;
    localStorage.setItem(uniqueKey, '1');
  }
  
  // Total visits
  trafficData.totalVisits++;
  
  // Session visits (resets on page reload, but we track it)
  trafficData.sessionVisits = (trafficData.sessionVisits || 0) + 1;
  
  // First visit
  if (!trafficData.firstVisit) {
    trafficData.firstVisit = now.toISOString();
  }
  
  // Last visit
  trafficData.lastVisit = now.toISOString();
  
  // Daily visits
  if (!trafficData.dailyVisits[today]) {
    trafficData.dailyVisits[today] = 0;
  }
  trafficData.dailyVisits[today]++;
  
  saveTrafficData();
  
  // Sync with server (if JSONBin.io is configured)
  if (USE_JSONBIN && TRAFFIC_API_URL && TRAFFIC_API_KEY) {
    syncVisitToServer(visitorId);
  }
}

// Sync visit to server (JSONBin.io for GitHub Pages)
async function syncVisitToServer(visitorId) {
  if (!USE_JSONBIN || !TRAFFIC_API_URL || !TRAFFIC_API_KEY) {
    console.debug('Traffic API: Disabled (using localStorage only)');
    return;
  }
  
  try {
    // First, get current global stats
    const getResponse = await fetch(TRAFFIC_API_URL + '/latest', {
      method: 'GET',
      headers: {
        'X-Master-Key': TRAFFIC_API_KEY,
        'X-Bin-Meta': 'false'
      }
    });
    
    let globalData = {
      totalVisits: 0,
      uniqueVisits: 0,
      toolUsage: {},
      dailyVisits: {},
      visitors: [],
      lastUpdate: null
    };
    
    if (getResponse.ok) {
      globalData = await getResponse.json();
      if (!globalData.visitors) globalData.visitors = [];
      if (!globalData.toolUsage) globalData.toolUsage = {};
      if (!globalData.dailyVisits) globalData.dailyVisits = {};
    }
    
    // Update global stats
    const now = new Date().toISOString();
    const today = now.split('T')[0];
    
    // Check if new unique visitor
    const isNewVisitor = !globalData.visitors.includes(visitorId);
    if (isNewVisitor) {
      globalData.uniqueVisits = (globalData.uniqueVisits || 0) + 1;
      globalData.visitors.push(visitorId);
      // Keep only last 1000 visitor IDs
      if (globalData.visitors.length > 1000) {
        globalData.visitors = globalData.visitors.slice(-1000);
      }
    }
    
    // Total visits
    globalData.totalVisits = (globalData.totalVisits || 0) + 1;
    
    // Daily visits
    if (!globalData.dailyVisits[today]) {
      globalData.dailyVisits[today] = 0;
    }
    globalData.dailyVisits[today]++;
    
    // Update timestamp
    globalData.lastUpdate = now;
    
    // Save back to JSONBin.io
    const putResponse = await fetch(TRAFFIC_API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': TRAFFIC_API_KEY
      },
      body: JSON.stringify(globalData)
    });
    
    if (putResponse.ok) {
      console.debug('Traffic API: Visit synced to global stats successfully');
    } else {
      const errorText = await putResponse.text();
      console.warn('Traffic API: Failed to update global stats', putResponse.status, errorText);
    }
  } catch (e) {
    // Silently fail - localStorage is primary storage
    console.debug('Traffic API: Failed to sync to global stats (using local only):', e.message);
  }
}

// Get or create visitor ID
function getVisitorId() {
  let visitorId = localStorage.getItem('cyberkit_visitor_id');
  if (!visitorId) {
    visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('cyberkit_visitor_id', visitorId);
  }
  return visitorId;
}

// Track tool usage
function trackToolUsage() {
  // Use capture phase to catch clicks early, before other handlers
  document.addEventListener('click', (e) => {
    // Find the button element (could be the target or a parent)
    let button = e.target;
    if (button.tagName !== 'BUTTON') {
      button = e.target.closest('button');
    }
    if (!button) return;
    
    const buttonId = button.id;
    if (!buttonId) return;
    
    // Check if this is a tracked tool
    const toolName = toolNames[buttonId];
    if (toolName) {
      // Increment local counter
      if (!trafficData.toolUsage[toolName]) {
        trafficData.toolUsage[toolName] = 0;
      }
      trafficData.toolUsage[toolName]++;
      saveTrafficData();
      
      // Update widget display
      updateTrafficWidget();
      
      // Sync tool usage to server (if JSONBin.io is configured)
      if (USE_JSONBIN && TRAFFIC_API_URL && TRAFFIC_API_KEY) {
        syncToolUsageToServer(toolName);
      }
      
      // Debug log (only in development)
      console.debug('Tool usage tracked:', toolName, 'Total:', trafficData.toolUsage[toolName]);
    }
  }, true); // Use capture phase
}

// Sync tool usage to server (JSONBin.io for GitHub Pages)
async function syncToolUsageToServer(toolName) {
  if (!USE_JSONBIN || !TRAFFIC_API_URL || !TRAFFIC_API_KEY) {
    console.debug('Traffic API: Disabled (using localStorage only)');
    return;
  }

  try {
    // First, get current global data
    const getResponse = await fetch(TRAFFIC_API_URL + '/latest', {
      method: 'GET',
      headers: {
        'X-Master-Key': TRAFFIC_API_KEY,
        'X-Bin-Meta': 'false'
      }
    });

    let globalData = {
      totalVisits: 0,
      uniqueVisits: 0,
      toolUsage: {},
      dailyVisits: {},
      visitors: [],
      lastUpdate: null
    };

    if (getResponse.ok) {
      globalData = await getResponse.json();
      if (!globalData.toolUsage) globalData.toolUsage = {};
    }

    // Update tool usage
    if (!globalData.toolUsage[toolName]) {
      globalData.toolUsage[toolName] = 0;
    }
    globalData.toolUsage[toolName]++;
    globalData.lastUpdate = new Date().toISOString(); // Update timestamp

    // Save back to JSONBin.io
    const putResponse = await fetch(TRAFFIC_API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': TRAFFIC_API_KEY
      },
      body: JSON.stringify(globalData)
    });

    if (putResponse.ok) {
      console.debug('Traffic API: Tool usage synced successfully', {
        toolName
      });
    } else {
      const errorText = await putResponse.text();
      console.warn('Traffic API: Failed to sync tool usage', putResponse.status, errorText);
    }
  } catch (e) {
    console.debug('Traffic API: Failed to sync tool usage to global stats (using local only):', e.message);
  }
}

// Initialize traffic widget
function initTrafficWidget() {
  // Check if widget already exists
  const existingWidget = document.getElementById('traffic-widget');
  if (existingWidget) {
    console.debug('Traffic widget already exists, skipping creation...');
    updateTrafficWidget(); // Just update the existing widget
    return;
  }
  
  // Create widget element
  const widget = document.createElement('div');
  widget.id = 'traffic-widget';
  widget.className = 'traffic-widget';
  
  widget.innerHTML = `
    <div class="traffic-widget-header">
      <span class="traffic-icon">📊</span>
      <span class="traffic-title">Stats</span>
      <button class="traffic-toggle" id="traffic-toggle">−</button>
    </div>
    <div class="traffic-widget-content" id="traffic-content">
      <div class="traffic-stat">
        <span class="traffic-label">Visits:</span>
        <span class="traffic-value" id="traffic-total">0</span>
      </div>
      <div class="traffic-stat">
        <span class="traffic-label">Unique:</span>
        <span class="traffic-value" id="traffic-unique">0</span>
      </div>
      <div class="traffic-stat">
        <span class="traffic-label">Today:</span>
        <span class="traffic-value" id="traffic-today">0</span>
      </div>
      <div class="traffic-stat">
        <span class="traffic-label">Tools Used:</span>
        <span class="traffic-value" id="traffic-tools">0</span>
      </div>
      <div class="traffic-details" id="traffic-details" style="display: none;">
        <div class="traffic-top-tools" id="traffic-top-tools"></div>
      </div>
    </div>
  `;
  
  // Append to stats section container
  const statsContainer = document.getElementById('traffic-widget-container');
  if (statsContainer) {
    statsContainer.appendChild(widget);
  } else {
    // Fallback to page container
    const pageContainer = document.querySelector('.page');
    if (pageContainer) {
      pageContainer.appendChild(widget);
    } else {
      document.body.appendChild(widget);
    }
  }
  
  // Toggle widget
  const toggle = document.getElementById('traffic-toggle');
  toggle.addEventListener('click', () => {
    const content = document.getElementById('traffic-content');
    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'block' : 'none';
    toggle.textContent = isHidden ? '−' : '+';
  });
  
  // Widget is now fixed to page end, no need for dragging
}

// Widget is now fixed to page end, no dragging needed

// Update traffic widget display
async function updateTrafficWidget() {
  const totalEl = document.getElementById('traffic-total');
  const uniqueEl = document.getElementById('traffic-unique');
  const todayEl = document.getElementById('traffic-today');
  const toolsEl = document.getElementById('traffic-tools');
  const topToolsEl = document.getElementById('traffic-top-tools');
  
  // Try to load global stats from JSONBin.io if enabled
  // Global stats show ALL users combined
  let serverStats = null;
  if (USE_JSONBIN && TRAFFIC_API_URL && TRAFFIC_API_KEY) {
    try {
      const response = await fetch(TRAFFIC_API_URL + '/latest', {
        method: 'GET',
        headers: {
          'X-Master-Key': TRAFFIC_API_KEY,
          'X-Bin-Meta': 'false'
        }
      });
      if (response.ok) {
        serverStats = await response.json();
        const today = new Date().toISOString().split('T')[0];
        serverStats.todayVisits = (serverStats.dailyVisits && serverStats.dailyVisits[today]) || 0;
        console.debug('Traffic API: Loaded global stats successfully', {
          totalVisits: serverStats.totalVisits,
          uniqueVisits: serverStats.uniqueVisits
        });
      } else {
        console.warn('Traffic API: Failed to load global stats', response.status, '- using local stats');
      }
    } catch (e) {
      // Fall back to local stats if server unavailable
      console.debug('Traffic API: Server unavailable, using local stats:', e.message);
    }
  }
  
  // Use server stats (GLOBAL) if available, otherwise fall back to local
  // Server stats show ALL users combined, local stats are per-browser
  const displayStats = serverStats || {
    totalVisits: trafficData.totalVisits,
    uniqueVisits: trafficData.uniqueVisits,
    todayVisits: (() => {
      const today = new Date().toISOString().split('T')[0];
      return trafficData.dailyVisits[today] || 0;
    })(),
    toolUsage: trafficData.toolUsage
  };
  
  if (totalEl) totalEl.textContent = formatNumber(displayStats.totalVisits);
  if (uniqueEl) uniqueEl.textContent = formatNumber(displayStats.uniqueVisits);
  
  // Today's visits
  if (todayEl) {
    const todayCount = serverStats ? displayStats.todayVisits : (() => {
      const today = new Date().toISOString().split('T')[0];
      return trafficData.dailyVisits[today] || 0;
    })();
    todayEl.textContent = formatNumber(todayCount);
  }
  
  // Total tool usage
  const totalToolUsage = Object.values(displayStats.toolUsage || {}).reduce((sum, count) => sum + count, 0);
  if (toolsEl) toolsEl.textContent = formatNumber(totalToolUsage);
  
  // Top tools
  if (topToolsEl) {
    const toolUsage = displayStats.toolUsage || displayStats.topTools || trafficData.toolUsage;
    const topTools = Object.entries(toolUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    if (topTools.length > 0) {
      topToolsEl.innerHTML = '<div class="traffic-section-title">Top Tools:</div>' +
        topTools.map(([tool, count]) => 
          `<div class="traffic-tool-item">
            <span class="traffic-tool-name">${tool}</span>
            <span class="traffic-tool-count">${formatNumber(count)}</span>
          </div>`
        ).join('');
    } else {
      topToolsEl.innerHTML = '<div class="traffic-section-title">No tools used yet</div>';
    }
  }
}

// Format number with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Export function to get traffic data (for admin view)
function getTrafficData() {
  return {
    ...trafficData,
    toolUsageSorted: Object.entries(trafficData.toolUsage)
      .sort((a, b) => b[1] - a[1])
      .map(([tool, count]) => ({ tool, count }))
  };
}

// Make it available globally for console access
window.getTrafficData = getTrafficData;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTrafficCounter);
} else {
  // DOM already loaded
  initTrafficCounter();
}

