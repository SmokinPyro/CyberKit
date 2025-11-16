/**
 * CyberKit Traffic Counter
 * Tracks visits and tool usage using localStorage
 */

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
function initTrafficCounter() {
  // Load existing data
  loadTrafficData();
  
  // Record visit
  recordVisit();
  
  // Initialize widget
  initTrafficWidget();
  
  // Track tool usage
  trackToolUsage();
  
  // Update widget display
  updateTrafficWidget();
}

// Load traffic data from localStorage
function loadTrafficData() {
  try {
    const saved = localStorage.getItem('cyberkit_traffic');
    if (saved) {
      trafficData = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load traffic data:', e);
  }
}

// Save traffic data to localStorage
function saveTrafficData() {
  try {
    localStorage.setItem('cyberkit_traffic', JSON.stringify(trafficData));
  } catch (e) {
    console.warn('Failed to save traffic data:', e);
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
}

// Get or create visitor ID
function getVisitorId() {
  let visitorId = localStorage.getItem('cyberkit_visitor_id');
  if (!visitorId) {
    visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cyberkit_visitor_id', visitorId);
  }
  return visitorId;
}

// Track tool usage
function trackToolUsage() {
  // Listen for all button clicks
  document.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    
    const buttonId = button.id;
    if (!buttonId) return;
    
    // Check if this is a tracked tool
    const toolName = toolNames[buttonId];
    if (toolName) {
      if (!trafficData.toolUsage[toolName]) {
        trafficData.toolUsage[toolName] = 0;
      }
      trafficData.toolUsage[toolName]++;
      saveTrafficData();
      updateTrafficWidget();
    }
  });
}

// Initialize traffic widget
function initTrafficWidget() {
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
  
  document.body.appendChild(widget);
  
  // Toggle widget
  const toggle = document.getElementById('traffic-toggle');
  toggle.addEventListener('click', () => {
    const content = document.getElementById('traffic-content');
    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'block' : 'none';
    toggle.textContent = isHidden ? '−' : '+';
  });
  
  // Make widget draggable (optional)
  makeWidgetDraggable(widget);
}

// Make widget draggable
function makeWidgetDraggable(widget) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  
  const header = widget.querySelector('.traffic-widget-header');
  
  header.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('traffic-toggle')) return;
    
    isDragging = true;
    initialX = e.clientX - widget.offsetLeft;
    initialY = e.clientY - widget.offsetTop;
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
    
    // Keep widget within viewport
    const maxX = window.innerWidth - widget.offsetWidth;
    const maxY = window.innerHeight - widget.offsetHeight;
    
    currentX = Math.max(0, Math.min(currentX, maxX));
    currentY = Math.max(0, Math.min(currentY, maxY));
    
    widget.style.left = currentX + 'px';
    widget.style.top = currentY + 'px';
    widget.style.right = 'auto';
    widget.style.bottom = 'auto';
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

// Update traffic widget display
function updateTrafficWidget() {
  const totalEl = document.getElementById('traffic-total');
  const uniqueEl = document.getElementById('traffic-unique');
  const todayEl = document.getElementById('traffic-today');
  const toolsEl = document.getElementById('traffic-tools');
  const topToolsEl = document.getElementById('traffic-top-tools');
  
  if (totalEl) totalEl.textContent = formatNumber(trafficData.totalVisits);
  if (uniqueEl) uniqueEl.textContent = formatNumber(trafficData.uniqueVisits);
  
  // Today's visits
  const today = new Date().toISOString().split('T')[0];
  const todayCount = trafficData.dailyVisits[today] || 0;
  if (todayEl) todayEl.textContent = formatNumber(todayCount);
  
  // Total tool usage
  const totalToolUsage = Object.values(trafficData.toolUsage).reduce((sum, count) => sum + count, 0);
  if (toolsEl) toolsEl.textContent = formatNumber(totalToolUsage);
  
  // Top tools
  if (topToolsEl) {
    const topTools = Object.entries(trafficData.toolUsage)
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

