/**
 * Netlify Serverless Function for Traffic API
 * This replaces traffic-api.php for Netlify hosting
 * 
 * Path: netlify/functions/traffic-api.js
 * 
 * ⚠️ IMPORTANT: Netlify Functions use /tmp which is EPHEMERAL
 * Data will be lost when function containers are recycled.
 * 
 * For persistent storage, consider:
 * - FaunaDB (free tier available)
 * - MongoDB Atlas (free tier available)
 * - Supabase (free tier available)
 * - Or use client-side localStorage as primary (current fallback)
 */

const fs = require('fs');
const path = require('path');

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

  // ⚠️ WARNING: /tmp is EPHEMERAL in Netlify Functions
  // Data will be lost when containers recycle
  // This is a limitation of serverless functions
  // Client-side localStorage is used as primary storage
  const dataFile = '/tmp/traffic-data.json';

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

  // Load existing data
  let data = defaultData;
  try {
    if (fs.existsSync(dataFile)) {
      const fileContent = fs.readFileSync(dataFile, 'utf8');
      const parsed = JSON.parse(fileContent);
      if (parsed && typeof parsed === 'object') {
        data = parsed;
      }
    }
  } catch (e) {
    console.error('Error reading data file:', e);
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

      // Save data (may be lost on container recycle - this is expected)
      try {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
      } catch (e) {
        console.error('Error writing data file:', e);
        // Don't fail - client-side will handle persistence
      }

      // Return success with warning if data might be ephemeral
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          totalVisits: data.totalVisits,
          uniqueVisits: data.uniqueVisits,
          warning: 'Server stats may reset due to ephemeral storage. Client-side stats are primary.'
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

