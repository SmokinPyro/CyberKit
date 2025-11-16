document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initMatrixBackground();
  initHelpers();
  initPasswordTool();
  initBase64Tools();
  initBase32Tool();
  initSha256Tool();
  initHexTool();
  initUrlTool();
  initClientInfoTool();
  initIpLookupTool();
  initTimeTool();
  initCipherTool();
  initJwtTool();
  initTokenTool();
});

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
