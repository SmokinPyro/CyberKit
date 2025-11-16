/**
 * Netlify Serverless Function for Traffic API
 * This replaces traffic-api.php for Netlify hosting
 * 
 * Path: netlify/functions/traffic-api.js
 * 
 * Uses Netlify Blobs for persistent global storage across all users
 */

const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Use Netlify Blobs for persistent global storage
  // Try to get credentials from context or environment variables
  const siteID = context.site?.id || process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_BLOBS_TOKEN || context.netlify?.authToken;
  
  if (!siteID || !token) {
    console.error('Netlify Blobs not configured. Missing siteID or token.');
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('NETLIFY')));
    // Fallback: return error or use alternative storage
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Blobs not configured',
        message: 'Netlify Blobs requires siteID and token. Please configure in Netlify dashboard.'
      })
    };
  }
  
  const store = getStore({
    name: 'traffic-stats',
    siteID: siteID,
    token: token
  });
  
  // Initialize data structure
  const defaultData = {
    totalVisits: 0,
    uniqueVisits: 0,
    toolUsage: {},
    dailyVisits: {},
    firstVisit: null,
    lastVisit: null,
    visitors: []
  };

  // Load existing data from Blobs
  let data = defaultData;
  try {
    const stored = await store.get('traffic-data');
    if (stored) {
      const parsed = typeof stored === 'string' ? JSON.parse(stored) : stored;
      if (parsed && typeof parsed === 'object') {
        data = { ...defaultData, ...parsed };
        console.log('Loaded data from Blobs:', {
          totalVisits: data.totalVisits,
          uniqueVisits: data.uniqueVisits
        });
      }
    }
  } catch (e) {
    console.error('Error reading from Blobs:', e);
    console.error('Blobs read error details:', {
      message: e.message,
      stack: e.stack
    });
    data = defaultData;
  }

  if (event.httpMethod === 'POST') {
    // Handle POST - record visit/usage
    try {
      const input = JSON.parse(event.body || '{}');
      
      const now = new Date().toISOString();
      const today = new Date().toISOString().split('T')[0];
      const visitorId = input.visitorId || 'unknown_' + Date.now();

      // Check if new unique visitor
      const isNewVisitor = !data.visitors || !data.visitors.includes(visitorId);
      if (isNewVisitor) {
        data.uniqueVisits = (data.uniqueVisits || 0) + 1;
        if (!data.visitors) data.visitors = [];
        data.visitors.push(visitorId);
        // Keep only last 1000 visitor IDs to prevent bloat
        if (data.visitors.length > 1000) {
          data.visitors = data.visitors.slice(-1000);
        }
      }

      // Total visits
      data.totalVisits = (data.totalVisits || 0) + 1;

      // First visit
      if (!data.firstVisit) {
        data.firstVisit = now;
      }

      // Last visit
      data.lastVisit = now;

      // Daily visits
      if (!data.dailyVisits) data.dailyVisits = {};
      if (!data.dailyVisits[today]) {
        data.dailyVisits[today] = 0;
      }
      data.dailyVisits[today]++;

      // Tool usage
      if (input.toolName) {
        const toolName = input.toolName;
        if (!data.toolUsage) data.toolUsage = {};
        if (!data.toolUsage[toolName]) {
          data.toolUsage[toolName] = 0;
        }
        data.toolUsage[toolName]++;
      }

      // Save data to Netlify Blobs (persistent global storage)
      try {
        await store.set('traffic-data', JSON.stringify(data));
        console.log('Traffic data saved to Blobs successfully', {
          totalVisits: data.totalVisits,
          uniqueVisits: data.uniqueVisits
        });
      } catch (e) {
        console.error('Error writing to Blobs:', e);
        console.error('Blobs error details:', {
          message: e.message,
          stack: e.stack
        });
        // Continue anyway - at least return current data
      }

      // Return success
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          totalVisits: data.totalVisits,
          uniqueVisits: data.uniqueVisits
        })
      };

    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON', details: e.message })
      };
    }

  } else {
    // Handle GET - return stats
    const today = new Date().toISOString().split('T')[0];
    const todayVisits = (data.dailyVisits && data.dailyVisits[today]) || 0;

    // Sort tool usage
    const toolUsage = data.toolUsage || {};
    const toolUsageSorted = Object.entries(toolUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .reduce((acc, [tool, count]) => {
        acc[tool] = count;
        return acc;
      }, {});

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        totalVisits: data.totalVisits || 0,
        uniqueVisits: data.uniqueVisits || 0,
        todayVisits: todayVisits,
        toolUsage: data.toolUsage || {},
        topTools: toolUsageSorted,
        firstVisit: data.firstVisit,
        lastVisit: data.lastVisit
      }, null, 2)
    };
  }
};

