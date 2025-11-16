/**
 * CyberKit - Browser-based Cybersecurity Tools
 * 
 * Tool initialization order (matches HTML structure):
 * 1. Core utilities (year, matrix background, helpers)
 * 2. Generators (password, token)
 * 3. Encoders (Base64, Base64URL, Base32, URL)
 * 4. Hashes (SHA-256, Multi-hash & HMAC)
 * 5. Converters (Hex, Time)
 * 6. Network tools (Client Info, IP Lookup, CIDR Calculator)
 * 7. Crypto tools (Cipher, JWT)
 */

document.addEventListener("DOMContentLoaded", () => {
  // Core utilities
  initYear();
  initMatrixBackground();
  initHelpers();
  
  // Traffic counter (initialize early)
  if (typeof initTrafficCounter === 'function') {
    initTrafficCounter();
  }
  
  // Generators
  initPasswordTool();
  initTokenTool();
  
  // Encoders
  initBase64Tools();
  initBase32Tool();
  initUrlTool();
  
  // Hashes
  initSha256Tool();
  initMultiHashTool();
  
  // Converters
  initHexTool();
  initTimeTool();
  
  // Network tools
  initClientInfoTool();
  initIpLookupTool();
  initCidrTool();
  
  // Crypto tools
  initCipherTool();
  initJwtTool();
  
  // Contact modal handlers
  initContactModal();
});

// Contact Modal Functions
function initContactModal() {
  // Close modal when clicking outside
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeContactModal();
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeContactModal();
      }
    });
  }
}

function showContactModal() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.style.display = 'flex';
    // Reset copy button state
    const copyBtn = document.querySelector('.contact-copy-btn');
    if (copyBtn) {
      copyBtn.classList.remove('copied');
      const copyText = copyBtn.querySelector('.contact-copy-text');
      if (copyText) {
        copyText.textContent = 'Copy';
      }
    }
  }
}

function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function copyEmailToClipboard() {
  const email = 'karimashraf0888@gmail.com';
  const copyBtn = document.querySelector('.contact-copy-btn');
  const copyText = copyBtn.querySelector('.contact-copy-text');
  
  // Use modern Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(() => {
      // Success feedback
      copyBtn.classList.add('copied');
      copyText.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyText.textContent = 'Copy';
      }, 2000);
    }).catch((err) => {
      // Fallback for older browsers
      fallbackCopyEmail(email, copyBtn, copyText);
    });
  } else {
    // Fallback for older browsers
    fallbackCopyEmail(email, copyBtn, copyText);
  }
}

function fallbackCopyEmail(email, copyBtn, copyText) {
  // Create temporary textarea
  const textarea = document.createElement('textarea');
  textarea.value = email;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, 99999); // For mobile devices
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      copyBtn.classList.add('copied');
      copyText.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyText.textContent = 'Copy';
      }, 2000);
    } else {
      alert('Failed to copy. Please copy manually: ' + email);
    }
  } catch (err) {
    alert('Failed to copy. Please copy manually: ' + email);
  }
  
  document.body.removeChild(textarea);
}

/* ---------- Footer year ---------- */

function initYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/* ---------- Matrix raining code background ---------- */

function initMatrixBackground() {
  const canvas = document.getElementById("matrix-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Increase this for bigger letters
  const fontSize = 18;
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef#$%&@";
  let columns;
  let drops;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(0);
  }

  function draw() {
    // Lower alpha => longer trails
    ctx.fillStyle = "rgba(2, 6, 23, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // bright head
      ctx.fillStyle = "#bbf7d0";
      ctx.fillText(text, x, y);

      // dim trail
      ctx.fillStyle = "#22c55e";
      ctx.fillText(text, x, y - fontSize);

      drops[i] += 0.5;

      if (y > canvas.height && Math.random() > 0.99) {
        drops[i] = 0;
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

/* ---------- Shared helpers ---------- */

let utf8ToB64, b64ToUtf8, b64ToB64Url, b64UrlToB64, utf8ToB64Url, b64UrlToUtf8;
let base32Encode, base32Decode;
let sha256Digest;
let randomBytes, bytesToHex, bytesToBase64Url;
let caesarShift;

function initHelpers() {
  utf8ToB64 = (str) => btoa(unescape(encodeURIComponent(str)));
  b64ToUtf8 = (str) => decodeURIComponent(escape(atob(str)));

  b64ToB64Url = (b64) =>
    b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  b64UrlToB64 = (b64url) => {
    let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4 !== 0) b64 += "=";
    return b64;
  };

  utf8ToB64Url = (str) => b64ToB64Url(utf8ToB64(str));
  b64UrlToUtf8 = (str) => b64ToUtf8(b64UrlToB64(str));

  const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

  base32Encode = (str) => {
    const utf8 = new TextEncoder().encode(str);
    let bits = "";
    for (let byte of utf8) bits += byte.toString(2).padStart(8, "0");
    let out = "";
    for (let i = 0; i < bits.length; i += 5) {
      const chunk = bits.slice(i, i + 5);
      if (!chunk) continue;
      const value = parseInt(chunk.padEnd(5, "0"), 2);
      out += BASE32_ALPHABET[value];
    }
    while (out.length % 8 !== 0) out += "=";
    return out;
  };

  base32Decode = (b32) => {
    const s = b32.toUpperCase().replace(/=+$/g, "");
    let bits = "";
    for (let ch of s) {
      const idx = BASE32_ALPHABET.indexOf(ch);
      if (idx === -1) throw new Error("Invalid Base32 char: " + ch);
      bits += idx.toString(2).padStart(5, "0");
    }
    const bytes = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }
    return new TextDecoder().decode(new Uint8Array(bytes));
  };

  sha256Digest = async (text) => {
    const data = new TextEncoder().encode(text);
    const hashBuf = await crypto.subtle.digest("SHA-256", data);
    const arr = Array.from(new Uint8Array(hashBuf));
    return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  // Helper to convert ArrayBuffer to hex string
  const bufferToHex = (buffer) => {
    const arr = Array.from(new Uint8Array(buffer));
    return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  };
  
  // Make bufferToHex available globally for multi-hash tool
  window.bufferToHex = bufferToHex;

  randomBytes = (len) => {
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    return arr;
  };

  bytesToHex = (bytes) =>
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  bytesToBase64Url = (bytes) => {
    let bin = "";
    for (let b of bytes) bin += String.fromCharCode(b);
    const b64 = btoa(bin);
    return b64ToB64Url(b64);
  };

  caesarShift = (text, shift) => {
    const a = "a".charCodeAt(0);
    const z = "z".charCodeAt(0);
    const A = "A".charCodeAt(0);
    const Z = "Z".charCodeAt(0);
    shift = ((shift % 26) + 26) % 26;
    let out = "";
    for (let ch of text) {
      const code = ch.charCodeAt(0);
      if (code >= a && code <= z) {
        out += String.fromCharCode(((code - a + shift) % 26) + a);
      } else if (code >= A && code <= Z) {
        out += String.fromCharCode(((code - A + shift) % 26) + A);
      } else {
        out += ch;
      }
    }
    return out;
  };
}

/* ---------- Password Generator ---------- */

function initPasswordTool() {
  const lengthInput = document.getElementById("pw-length");
  const lengthValue = document.getElementById("pw-length-value");
  const lower = document.getElementById("pw-lower");
  const upper = document.getElementById("pw-upper");
  const digits = document.getElementById("pw-digits");
  const symbols = document.getElementById("pw-symbols");
  const output = document.getElementById("pw-output");
  const generateBtn = document.getElementById("pw-generate-btn");
  const copyBtn = document.getElementById("pw-copy-btn");
  const msg = document.getElementById("pw-strength-msg");

  if (
    !lengthInput ||
    !lengthValue ||
    !lower ||
    !upper ||
    !digits ||
    !symbols ||
    !output ||
    !generateBtn ||
    !copyBtn ||
    !msg
  ) {
    return;
  }

  const updateLengthLabel = () => {
    lengthValue.textContent = lengthInput.value;
  };

  const updateStrength = () => {
    const length = parseInt(lengthInput.value, 10);
    let variety = 0;
    if (lower.checked) variety++;
    if (upper.checked) variety++;
    if (digits.checked) variety++;
    if (symbols.checked) variety++;

    let label = "Weak";
    if (length >= 12 && variety >= 3) label = "Good";
    if (length >= 16 && variety >= 3) label = "Strong";
    if (length >= 20 && variety === 4) label = "Very strong";

    msg.innerHTML =
      "<span class='pill-metric'><span class='pill-dot-green'></span>Strength: <strong>" +
      label +
      "</strong> · length " +
      length +
      " · sets " +
      variety +
      "</span>";
  };

  const generate = () => {
    const length = parseInt(lengthInput.value, 10);
    let chars = "";
    if (lower.checked) chars += "abcdefghijklmnopqrstuvwxyz";
    if (upper.checked) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (digits.checked) chars += "0123456789";
    if (symbols.checked) chars += "!@#$%^&*()_-+=[]{};:,.?/|~";

    if (!chars) {
      msg.innerHTML =
        "<span class='pill-metric'><span class='pill-dot-red'></span>Select at least one character set.</span>";
      return;
    }

    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[arr[i] % chars.length];
    }
    output.value = result;
    updateStrength();
  };

  lengthInput.addEventListener("input", () => {
    updateLengthLabel();
    updateStrength();
  });

  [lower, upper, digits, symbols].forEach((el) =>
    el.addEventListener("change", updateStrength)
  );

  generateBtn.addEventListener("click", generate);

  copyBtn.addEventListener("click", () => {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
      msg.innerHTML =
        "<span class='pill-metric'><span class='pill-dot-green'></span>Password copied.</span>";
    });
  });

  updateLengthLabel();
  generate();
}

/* ---------- Base64 & Base64URL ---------- */

function initBase64Tools() {
  const b64Input = document.getElementById("b64-input");
  const b64Output = document.getElementById("b64-output");
  const b64EncodeBtn = document.getElementById("b64-encode-btn");
  const b64DecodeBtn = document.getElementById("b64-decode-btn");
  const b64CopyBtn = document.getElementById("b64-copy-btn");
  const b64Msg = document.getElementById("b64-msg");

  if (
    b64Input &&
    b64Output &&
    b64EncodeBtn &&
    b64DecodeBtn &&
    b64CopyBtn &&
    b64Msg
  ) {
    b64EncodeBtn.addEventListener("click", () => {
      try {
        b64Output.value = utf8ToB64(b64Input.value || "");
        b64Msg.textContent = "Encoded successfully.";
      } catch {
        b64Msg.textContent = "Error encoding text.";
      }
    });

    b64DecodeBtn.addEventListener("click", () => {
      try {
        b64Output.value = b64ToUtf8(b64Input.value || "");
        b64Msg.textContent = "Decoded successfully.";
      } catch {
        b64Msg.textContent = "Error decoding Base64 – invalid input?";
      }
    });

    b64CopyBtn.addEventListener("click", () => {
      if (!b64Output.value) return;
      navigator.clipboard.writeText(b64Output.value).then(() => {
        b64Msg.textContent = "Output copied.";
      });
    });
  }

  const b64uInput = document.getElementById("b64u-input");
  const b64uOutput = document.getElementById("b64u-output");
  const b64uEncodeBtn = document.getElementById("b64u-encode-btn");
  const b64uDecodeBtn = document.getElementById("b64u-decode-btn");
  const b64uCopyBtn = document.getElementById("b64u-copy-btn");
  const b64uMsg = document.getElementById("b64u-msg");

  if (
    b64uInput &&
    b64uOutput &&
    b64uEncodeBtn &&
    b64uDecodeBtn &&
    b64uCopyBtn &&
    b64uMsg
  ) {
    b64uEncodeBtn.addEventListener("click", () => {
      try {
        b64uOutput.value = utf8ToB64Url(b64uInput.value || "");
        b64uMsg.textContent = "Encoded to Base64URL.";
      } catch {
        b64uMsg.textContent = "Error encoding text.";
      }
    });

    b64uDecodeBtn.addEventListener("click", () => {
      try {
        b64uOutput.value = b64UrlToUtf8(b64uInput.value || "");
        b64uMsg.textContent = "Decoded from Base64URL.";
      } catch {
        b64uMsg.textContent = "Error decoding Base64URL – invalid input?";
      }
    });

    b64uCopyBtn.addEventListener("click", () => {
      if (!b64uOutput.value) return;
      navigator.clipboard.writeText(b64uOutput.value).then(() => {
        b64uMsg.textContent = "Output copied.";
      });
    });
  }
}

/* ---------- Base32 ---------- */

function initBase32Tool() {
  const input = document.getElementById("b32-input");
  const output = document.getElementById("b32-output");
  const encodeBtn = document.getElementById("b32-encode-btn");
  const decodeBtn = document.getElementById("b32-decode-btn");
  const copyBtn = document.getElementById("b32-copy-btn");
  const msg = document.getElementById("b32-msg");

  if (!input || !output || !encodeBtn || !decodeBtn || !copyBtn || !msg) return;

  encodeBtn.addEventListener("click", () => {
    try {
      output.value = base32Encode(input.value || "");
      msg.textContent = "Encoded to Base32.";
    } catch {
      msg.textContent = "Error encoding text.";
    }
  });

  decodeBtn.addEventListener("click", () => {
    try {
      output.value = base32Decode(input.value || "");
      msg.textContent = "Decoded from Base32.";
    } catch (e) {
      msg.textContent = "Error decoding Base32 – " + e.message;
    }
  });

  copyBtn.addEventListener("click", () => {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
      msg.textContent = "Output copied.";
    });
  });
}

/* ---------- SHA-256 ---------- */

function initSha256Tool() {
  const input = document.getElementById("sha-input");
  const output = document.getElementById("sha-output");
  const generateBtn = document.getElementById("sha-generate-btn");
  const copyBtn = document.getElementById("sha-copy-btn");
  const msg = document.getElementById("sha-msg");

  if (!input || !output || !generateBtn || !copyBtn || !msg) return;

  generateBtn.addEventListener("click", async () => {
    const text = input.value || "";
    if (!text) {
      msg.textContent = "Enter text to hash.";
      return;
    }
    msg.textContent = "Hashing…";
    try {
      output.value = await sha256Digest(text);
      msg.textContent = "Hash generated.";
    } catch {
      msg.textContent = "Error generating hash.";
    }
  });

  copyBtn.addEventListener("click", () => {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
      msg.textContent = "Hash copied.";
    });
  });
}

/* ---------- Hex <-> Text ---------- */

function initHexTool() {
  const input = document.getElementById("hex-input");
  const output = document.getElementById("hex-output");
  const hexToTextBtn = document.getElementById("hex-to-text-btn");
  const textToHexBtn = document.getElementById("text-to-hex-btn");
  const copyBtn = document.getElementById("hex-copy-btn");
  const msg = document.getElementById("hex-msg");

  if (!input || !output || !hexToTextBtn || !textToHexBtn || !copyBtn || !msg) return;

  const hexToText = (hexStr) => {
    const cleaned = hexStr.replace(/[^0-9a-fA-F]/g, "");
    if (!cleaned) return "";
    if (cleaned.length % 2 !== 0) throw new Error("Hex string has odd length.");
    let out = "";
    for (let i = 0; i < cleaned.length; i += 2) {
      const byte = cleaned.slice(i, i + 2);
      const val = parseInt(byte, 16);
      if (Number.isNaN(val)) throw new Error("Invalid hex byte: " + byte);
      out += String.fromCharCode(val);
    }
    return out;
  };

  const textToHex = (str) => {
    const parts = [];
    for (let i = 0; i < str.length; i++) {
      parts.push(str.charCodeAt(i).toString(16).padStart(2, "0"));
    }
    return parts.join(" ");
  };

  hexToTextBtn.addEventListener("click", () => {
    try {
      output.value = hexToText(input.value || "");
      msg.textContent = "Converted hex to text.";
    } catch (e) {
      msg.textContent = "Error: " + e.message;
    }
  });

  textToHexBtn.addEventListener("click", () => {
    output.value = textToHex(input.value || "");
    msg.textContent = "Converted text to hex.";
  });

  copyBtn.addEventListener("click", () => {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
      msg.textContent = "Output copied.";
    });
  });
}

/* ---------- URL Encode / Decode ---------- */

function initUrlTool() {
  const input = document.getElementById("url-input");
  const output = document.getElementById("url-output");
  const encodeBtn = document.getElementById("url-encode-btn");
  const decodeBtn = document.getElementById("url-decode-btn");
  const copyBtn = document.getElementById("url-copy-btn");
  const msg = document.getElementById("url-msg");

  if (!input || !output || !encodeBtn || !decodeBtn || !copyBtn || !msg) return;

  encodeBtn.addEventListener("click", () => {
    try {
      output.value = encodeURIComponent(input.value || "");
      msg.textContent = "Encoded successfully.";
    } catch {
      msg.textContent = "Error encoding input.";
    }
  });

  decodeBtn.addEventListener("click", () => {
    try {
      output.value = decodeURIComponent(input.value || "");
      msg.textContent = "Decoded successfully.";
    } catch {
      msg.textContent = "Error decoding – invalid percent-encoding?";
    }
  });

  copyBtn.addEventListener("click", () => {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
      msg.textContent = "Output copied.";
    });
  });
}

/* ---------- Client Info / IP Viewer ---------- */

function initClientInfoTool() {
  const ipInput = document.getElementById("client-ip");
  const ua = document.getElementById("client-ua");
  const platform = document.getElementById("client-platform");
  const tzLang = document.getElementById("client-tz-lang");
  const screenField = document.getElementById("client-screen");
  const refreshBtn = document.getElementById("client-refresh-btn");
  const msg = document.getElementById("clientinfo-msg");

  if (!ua || !platform || !tzLang || !screenField || !refreshBtn || !msg) return;

  const fillLocal = () => {
    ua.value = navigator.userAgent || "Unknown";
    platform.value = navigator.platform || "Unknown";
    const tz =
      (Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown TZ");
    const lang = navigator.language || "Unknown language";
    tzLang.value = `${tz} · ${lang}`;
    const scr = window.screen;
    screenField.value = scr
      ? `${scr.width}×${scr.height} (${scr.pixelDepth || 24}-bit)`
      : "Unknown screen";
  };

  const fetchIp = async () => {
    if (!ipInput) return;
    msg.textContent = "Querying public IP from ipify.org…";
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      ipInput.value = data.ip || "Unknown";
      msg.textContent = "Public IP loaded.";
    } catch {
      ipInput.value = "";
      msg.textContent =
        "Could not fetch public IP (blocked, offline, or CORS).";
    }
  };

  refreshBtn.addEventListener("click", () => {
    fillLocal();
    fetchIp();
  });

  fillLocal();
}

/* ---------- IP Lookup ---------- */

function initIpLookupTool() {
  const toggle = document.getElementById("ip-lookup-toggle");
  const input = document.getElementById("ip-lookup-input");
  const btn = document.getElementById("ip-lookup-btn");
  const output = document.getElementById("ip-lookup-output");
  const msg = document.getElementById("iplookup-msg");

  if (!toggle || !input || !btn || !output || !msg) return;

  btn.addEventListener("click", async () => {
    if (!toggle.checked) {
      msg.textContent = "Tick the checkbox to allow lookup via ipwho.is.";
      return;
    }
    const query = (input.value || "").trim();
    if (!query) {
      msg.textContent = "Enter an IP address or domain.";
      return;
    }
    msg.textContent = "Looking up IP via ipwho.is…";
    output.value = "";
    try {
      const res = await fetch("https://ipwho.is/" + encodeURIComponent(query));
      const data = await res.json();
      if (!data.success) {
        msg.textContent = "Lookup failed: " + (data.message || "Unknown");
        return;
      }
      const lines = [];
      lines.push(`IP: ${data.ip}`);
      if (data.type) lines.push(`Type: ${data.type}`);
      if (data.continent)
        lines.push(`Continent: ${data.continent} (${data.continent_code})`);
      if (data.country)
        lines.push(`Country: ${data.country} (${data.country_code})`);
      if (data.region)
        lines.push(`Region: ${data.region} (${data.region_code})`);
      if (data.city) lines.push(`City: ${data.city}`);
      if (typeof data.latitude === "number" && typeof data.longitude === "number") {
        lines.push(`Location: ${data.latitude}, ${data.longitude}`);
      }
      if (data.connection) {
        const c = data.connection;
        const parts = [];
        if (c.isp) parts.push(`ISP: ${c.isp}`);
        if (c.org) parts.push(`Org: ${c.org}`);
        if (c.domain) parts.push(`Domain: ${c.domain}`);
        if (parts.length) lines.push(parts.join(" · "));
      }
      if (data.security) {
        const s = data.security;
        const flags = [];
        if (s.is_proxy) flags.push("proxy");
        if (s.is_vpn) flags.push("VPN");
        if (s.is_tor) flags.push("Tor");
        if (s.is_abuser) flags.push("abuser");
        if (flags.length) lines.push("Security flags: " + flags.join(", "));
      }
      output.value = lines.join("\n");
      msg.textContent = "IP lookup completed (approximate).";
    } catch {
      msg.textContent = "Error performing lookup (network / CORS).";
    }
  });
}

/* ---------- Unix Timestamp Converter ---------- */

function initTimeTool() {
  const tsInput = document.getElementById("ts-input");
  const dateInput = document.getElementById("date-input");
  const tsToDateBtn = document.getElementById("ts-to-date-btn");
  const dateToTsBtn = document.getElementById("date-to-ts-btn");
  const msg = document.getElementById("time-msg");

  if (!tsInput || !dateInput || !tsToDateBtn || !dateToTsBtn || !msg) return;

  tsToDateBtn.addEventListener("click", () => {
    const raw = (tsInput.value || "").trim();
    if (!raw) {
      msg.textContent = "Enter a timestamp.";
      return;
    }
    const num = Number(raw);
    if (!Number.isFinite(num)) {
      msg.textContent = "Invalid number.";
      return;
    }
    const ms = num < 1e12 ? num * 1000 : num;
    const d = new Date(ms);
    if (isNaN(d.getTime())) {
      msg.textContent = "Invalid timestamp.";
      return;
    }
    dateInput.value = d.toISOString();
    msg.textContent = "Converted to UTC ISO date.";
  });

  dateToTsBtn.addEventListener("click", () => {
    let v = (dateInput.value || "").trim();
    let d = v ? new Date(v) : new Date();
    if (isNaN(d.getTime())) {
      msg.textContent = "Invalid date/time.";
      return;
    }
    const seconds = Math.floor(d.getTime() / 1000);
    tsInput.value = String(seconds);
    msg.textContent = "Converted to Unix timestamp (seconds).";
  });
}

/* ---------- ROT13 / Caesar Cipher ---------- */

function initCipherTool() {
  const input = document.getElementById("cipher-input");
  const output = document.getElementById("cipher-output");
  const shiftInput = document.getElementById("cipher-shift");
  const shiftValue = document.getElementById("cipher-shift-value");
  const rot13Btn = document.getElementById("cipher-rot13-btn");
  const encodeBtn = document.getElementById("cipher-encode-btn");
  const decodeBtn = document.getElementById("cipher-decode-btn");
  const copyBtn = document.getElementById("cipher-copy-btn");
  const msg = document.getElementById("cipher-msg");

  if (
    !input ||
    !output ||
    !shiftInput ||
    !shiftValue ||
    !rot13Btn ||
    !encodeBtn ||
    !decodeBtn ||
    !copyBtn ||
    !msg
  ) {
    return;
  }

  shiftInput.addEventListener("input", () => {
    shiftValue.textContent = shiftInput.value;
  });

  const runCipher = (shift) => {
    const text = input.value || "";
    if (!text) {
      msg.textContent = "Enter some text.";
      return;
    }
    output.value = caesarShift(text, shift);
    msg.textContent = "Cipher applied with shift " + shift + ".";
  };

  rot13Btn.addEventListener("click", () => {
    runCipher(13);
    shiftInput.value = 13;
    shiftValue.textContent = "13";
  });

  encodeBtn.addEventListener("click", () => {
    const shift = parseInt(shiftInput.value, 10) || 0;
    runCipher(shift);
  });

  decodeBtn.addEventListener("click", () => {
    const shift = parseInt(shiftInput.value, 10) || 0;
    runCipher(-shift);
  });

  copyBtn.addEventListener("click", () => {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
      msg.textContent = "Output copied.";
    });
  });
}

/* ---------- JWT Decoder ---------- */

function initJwtTool() {
  const input = document.getElementById("jwt-input");
  const headerOut = document.getElementById("jwt-header-output");
  const payloadOut = document.getElementById("jwt-payload-output");
  const decodeBtn = document.getElementById("jwt-decode-btn");
  const msg = document.getElementById("jwt-msg");

  if (!input || !headerOut || !payloadOut || !decodeBtn || !msg) return;

  decodeBtn.addEventListener("click", () => {
    const token = (input.value || "").trim();
    if (!token) {
      msg.textContent = "Enter a JWT.";
      return;
    }
    const parts = token.split(".");
    if (parts.length < 2) {
      msg.textContent = "Invalid JWT format (need at least header.payload).";
      return;
    }
    try {
      const headerJson = b64UrlToUtf8(parts[0] || "");
      const payloadJson = b64UrlToUtf8(parts[1] || "");
      try {
        headerOut.value = JSON.stringify(JSON.parse(headerJson), null, 2);
      } catch {
        headerOut.value = headerJson;
      }
      try {
        payloadOut.value = JSON.stringify(JSON.parse(payloadJson), null, 2);
      } catch {
        payloadOut.value = payloadJson;
      }
      msg.textContent =
        "Decoded header and payload. Signature is NOT verified.";
    } catch (e) {
      msg.textContent = "Error decoding JWT: " + e.message;
    }
  });
}

/* ---------- Random Token / API Key Generator ---------- */

function initTokenTool() {
  const typeSelect = document.getElementById("token-type-select");
  const lenInput = document.getElementById("token-length");
  const lenValue = document.getElementById("token-length-value");
  const output = document.getElementById("token-output");
  const generateBtn = document.getElementById("token-generate-btn");
  const copyBtn = document.getElementById("token-copy-btn");
  const msg = document.getElementById("token-msg");

  if (!typeSelect || !lenInput || !lenValue || !output || !generateBtn || !copyBtn || !msg)
    return;

  lenInput.addEventListener("input", () => {
    lenValue.textContent = lenInput.value;
  });

  const generate = () => {
    const type = typeSelect.value;
    const length = parseInt(lenInput.value, 10) || 32;
    let token = "";

    if (type === "hex") {
      token = bytesToHex(randomBytes(length));
      msg.textContent = `Generated hex token (${token.length} chars).`;
    } else if (type === "base64url") {
      token = bytesToBase64Url(randomBytes(length));
      msg.textContent = `Generated Base64URL token (~${token.length} chars).`;
    } else {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const bytes = randomBytes(length);
      let out = "";
      for (let b of bytes) out += chars[b % chars.length];
      token = out;
      msg.textContent = `Generated alphanumeric token (${token.length} chars).`;
    }

    output.value = token;
  };

  generateBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", () => {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
      msg.textContent = "Token copied.";
    });
  });
}

/* ---------- MD5 Implementation ---------- */

function md5(str) {
  // MD5 implementation (plain JS, no dependencies)
  function md5cycle(x, k) {
    let a = x[0], b = x[1], c = x[2], d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }

  function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }

  function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }

  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  function add32(a, b) {
    return (a + b) & 0xFFFFFFFF;
  }

  function rhex(n) {
    let s = "", j = 0;
    for (; j < 4; j++)
      s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
    return s;
  }

  const hex_chr = "0123456789abcdef".split("");

  function md51(s) {
    const n = s.length * 8;
    s += "\x80";
    while (s.length % 64 !== 56) s += "\x00";
    s += String.fromCharCode((n >> 0) & 0xFF);
    s += String.fromCharCode((n >> 8) & 0xFF);
    s += String.fromCharCode((n >> 16) & 0xFF);
    s += String.fromCharCode((n >> 24) & 0xFF);
    s += String.fromCharCode((n >> 32) & 0xFF);
    s += String.fromCharCode((n >> 40) & 0xFF);
    s += String.fromCharCode((n >> 48) & 0xFF);
    s += String.fromCharCode((n >> 56) & 0xFF);

    const x = [];
    for (let i = 0; i < s.length; i += 4) {
      x[i >> 2] = s.charCodeAt(i) | (s.charCodeAt(i + 1) << 8) | (s.charCodeAt(i + 2) << 16) | (s.charCodeAt(i + 3) << 24);
    }

    const h = [1732584193, -271733879, -1732584194, 271733878];
    for (let i = 0; i < x.length; i += 16) {
      const olda = h[0], oldb = h[1], oldc = h[2], oldd = h[3];
      h[0] = olda; h[1] = oldb; h[2] = oldc; h[3] = oldd;
      md5cycle(h, x.slice(i, i + 16));
      h[0] = add32(h[0], olda);
      h[1] = add32(h[1], oldb);
      h[2] = add32(h[2], oldc);
      h[3] = add32(h[3], oldd);
    }
    return h;
  }

  const h = md51(str);
  return rhex(h[0]) + rhex(h[1]) + rhex(h[2]) + rhex(h[3]);
}

/* ---------- Multi-hash & HMAC Generator ---------- */

function initMultiHashTool() {
  const input = document.getElementById("mh-input");
  const keyInput = document.getElementById("mh-key");
  const generateBtn = document.getElementById("mh-generate-btn");
  const md5Output = document.getElementById("mh-md5");
  const sha1Output = document.getElementById("mh-sha1");
  const sha256Output = document.getElementById("mh-sha256");
  const sha512Output = document.getElementById("mh-sha512");
  const hmacOutput = document.getElementById("mh-hmac");
  const msg = document.getElementById("mh-msg");

  const copyBtns = {
    md5: document.getElementById("mh-md5-copy"),
    sha1: document.getElementById("mh-sha1-copy"),
    sha256: document.getElementById("mh-sha256-copy"),
    sha512: document.getElementById("mh-sha512-copy"),
    hmac: document.getElementById("mh-hmac-copy")
  };

  if (!input || !keyInput || !generateBtn || !md5Output || !sha1Output || 
      !sha256Output || !sha512Output || !hmacOutput || !msg) return;

  // Helper to compute hash using Web Crypto API
  const computeHash = async (algorithm, text) => {
    const data = new TextEncoder().encode(text);
    const hashBuf = await crypto.subtle.digest(algorithm, data);
    return window.bufferToHex(hashBuf);
  };

  // Helper to compute HMAC-SHA256
  const computeHMAC = async (text, key) => {
    const keyData = new TextEncoder().encode(key);
    const textData = new TextEncoder().encode(text);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, textData);
    return window.bufferToHex(signature);
  };

  generateBtn.addEventListener("click", async () => {
    const text = input.value || "";
    if (!text) {
      msg.textContent = "Enter text to hash.";
      return;
    }

    msg.textContent = "Computing hashes…";
    
    try {
      // MD5 (synchronous)
      md5Output.value = md5(text);

      // SHA-1, SHA-256, SHA-512 (async)
      sha1Output.value = await computeHash("SHA-1", text);
      sha256Output.value = await computeHash("SHA-256", text);
      sha512Output.value = await computeHash("SHA-512", text);

      // HMAC if key provided
      const key = keyInput.value.trim();
      if (key) {
        hmacOutput.value = await computeHMAC(text, key);
        msg.textContent = "All hashes and HMAC computed.";
      } else {
        hmacOutput.value = "";
        msg.textContent = "All hashes computed. (HMAC skipped - no key provided)";
      }
    } catch (e) {
      msg.textContent = "Error computing hashes: " + e.message;
    }
  });

  // Copy handlers
  copyBtns.md5?.addEventListener("click", () => {
    if (!md5Output.value) return;
    navigator.clipboard.writeText(md5Output.value).then(() => {
      msg.textContent = "MD5 copied.";
    });
  });

  copyBtns.sha1?.addEventListener("click", () => {
    if (!sha1Output.value) return;
    navigator.clipboard.writeText(sha1Output.value).then(() => {
      msg.textContent = "SHA-1 copied.";
    });
  });

  copyBtns.sha256?.addEventListener("click", () => {
    if (!sha256Output.value) return;
    navigator.clipboard.writeText(sha256Output.value).then(() => {
      msg.textContent = "SHA-256 copied.";
    });
  });

  copyBtns.sha512?.addEventListener("click", () => {
    if (!sha512Output.value) return;
    navigator.clipboard.writeText(sha512Output.value).then(() => {
      msg.textContent = "SHA-512 copied.";
    });
  });

  copyBtns.hmac?.addEventListener("click", () => {
    if (!hmacOutput.value) return;
    navigator.clipboard.writeText(hmacOutput.value).then(() => {
      msg.textContent = "HMAC-SHA256 copied.";
    });
  });
}

/* ---------- Subnet / CIDR Calculator ---------- */

function initCidrTool() {
  const input = document.getElementById("cidr-input");
  const calcBtn = document.getElementById("cidr-calc-btn");
  const networkOut = document.getElementById("cidr-network");
  const broadcastOut = document.getElementById("cidr-broadcast");
  const firstHostOut = document.getElementById("cidr-first-host");
  const lastHostOut = document.getElementById("cidr-last-host");
  const hostsOut = document.getElementById("cidr-hosts");
  const netmaskOut = document.getElementById("cidr-netmask");
  const wildcardOut = document.getElementById("cidr-wildcard");
  const msg = document.getElementById("cidr-msg");

  if (!input || !calcBtn || !networkOut || !broadcastOut || !firstHostOut ||
      !lastHostOut || !hostsOut || !netmaskOut || !wildcardOut || !msg) return;

  // Helper: Parse IPv4 to integer
  function parseIpv4ToInt(ipStr) {
    const parts = ipStr.split(".");
    if (parts.length !== 4) return null;
    const octets = parts.map(p => parseInt(p, 10));
    if (octets.some(o => isNaN(o) || o < 0 || o > 255)) return null;
    return (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
  }

  // Helper: Integer to IPv4 string
  function intToIpv4(int) {
    return [
      (int >>> 24) & 0xFF,
      (int >>> 16) & 0xFF,
      (int >>> 8) & 0xFF,
      int & 0xFF
    ].join(".");
  }

  calcBtn.addEventListener("click", () => {
    const inputStr = (input.value || "").trim();
    if (!inputStr) {
      msg.textContent = "Enter an IPv4 address with CIDR notation (e.g. 192.168.1.42/24).";
      clearOutputs();
      return;
    }

    const parts = inputStr.split("/");
    if (parts.length !== 2) {
      msg.textContent = "Invalid format. Expected IPv4/CIDR (e.g. 192.168.1.42/24).";
      clearOutputs();
      return;
    }

    const ipStr = parts[0].trim();
    const prefixStr = parts[1].trim();
    const prefix = parseInt(prefixStr, 10);

    if (isNaN(prefix) || prefix < 0 || prefix > 32) {
      msg.textContent = "Invalid prefix length. Must be 0-32.";
      clearOutputs();
      return;
    }

    const ipInt = parseIpv4ToInt(ipStr);
    if (ipInt === null) {
      msg.textContent = "Invalid IPv4 address. Each octet must be 0-255.";
      clearOutputs();
      return;
    }

    try {
      // Calculate netmask
      const netmaskInt = (prefix === 0) ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
      
      // Network address
      const networkInt = (ipInt & netmaskInt) >>> 0;
      
      // Broadcast address
      const broadcastInt = (networkInt | (~netmaskInt >>> 0)) >>> 0;
      
      // Wildcard mask
      const wildcardInt = (~netmaskInt) >>> 0;
      
      // Host count
      let hostCount = 0;
      let firstHost = "";
      let lastHost = "";
      
      if (prefix < 31) {
        hostCount = Math.max(0, (2 ** (32 - prefix)) - 2);
        if (hostCount > 0) {
          firstHost = intToIpv4((networkInt + 1) >>> 0);
          lastHost = intToIpv4((broadcastInt - 1) >>> 0);
        }
      } else if (prefix === 31) {
        // /31 networks: 2 addresses, both usable (point-to-point)
        hostCount = 2;
        firstHost = intToIpv4(networkInt);
        lastHost = intToIpv4(broadcastInt);
      } else {
        // /32: single host
        hostCount = 1;
        firstHost = intToIpv4(networkInt);
        lastHost = intToIpv4(networkInt);
      }

      // Fill outputs
      networkOut.value = intToIpv4(networkInt);
      broadcastOut.value = intToIpv4(broadcastInt);
      firstHostOut.value = firstHost;
      lastHostOut.value = lastHost;
      hostsOut.value = hostCount.toString();
      netmaskOut.value = intToIpv4(netmaskInt);
      wildcardOut.value = intToIpv4(wildcardInt);

      msg.textContent = `Calculated /${prefix} subnet for ${ipStr}.`;
    } catch (e) {
      msg.textContent = "Error calculating subnet: " + e.message;
      clearOutputs();
    }
  });

  function clearOutputs() {
    networkOut.value = "";
    broadcastOut.value = "";
    firstHostOut.value = "";
    lastHostOut.value = "";
    hostsOut.value = "";
    netmaskOut.value = "";
    wildcardOut.value = "";
  }
}
