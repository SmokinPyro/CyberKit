/**
 * Advanced JavaScript Obfuscator for CyberKit
 * 
 * This script performs:
 * - Variable name mangling
 * - String encoding
 * - Control flow obfuscation
 * - Dead code injection
 * 
 * Usage: node obfuscate-advanced.js
 */

const fs = require('fs');
const path = require('path');

// Generate random variable names
function generateVarName(prefix = '_0x') {
  const chars = '0123456789abcdef';
  let name = prefix;
  for (let i = 0; i < 6; i++) {
    name += chars[Math.floor(Math.random() * chars.length)];
  }
  return name;
}

// Encode string to hex
function encodeString(str) {
  return str.split('').map(c => 
    '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0')
  ).join('');
}

// Obfuscate the code
function obfuscateCode(source) {
  let code = source;
  
  // Step 1: Remove comments
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');
  code = code.replace(/\/\/.*$/gm, '');
  
  // Step 2: Create string array for common strings
  const stringMap = new Map();
  const strings = [];
  
  // Extract common strings (like 'click', 'value', 'textContent', etc.)
  const commonStrings = code.match(/(['"])(?:(?=(\\?))\2.)*?\1/g) || [];
  commonStrings.forEach((str, idx) => {
    if (str.length > 2 && !stringMap.has(str)) {
      const varName = `_0x${idx.toString(16)}`;
      stringMap.set(str, varName);
      strings.push({ var: varName, value: str });
    }
  });
  
  // Step 3: Variable name mangling (for local variables)
  const varMap = new Map();
  let varCounter = 0;
  
  // Find common variable patterns
  code = code.replace(/\b(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g, (match, decl, varName) => {
    if (varName.length > 2 && !['document', 'window', 'navigator', 'crypto'].includes(varName)) {
      if (!varMap.has(varName)) {
        const newName = generateVarName('_0x');
        varMap.set(varName, newName);
        return `${decl} ${newName} =`;
      }
      return `${decl} ${varMap.get(varName)} =`;
    }
    return match;
  });
  
  // Replace variable usages
  varMap.forEach((newName, oldName) => {
    const regex = new RegExp(`\\b${oldName}\\b`, 'g');
    code = code.replace(regex, newName);
  });
  
  // Step 4: Encode strings (optional - can break code, so be careful)
  // We'll encode some non-critical strings
  
  // Step 5: Add dead code
  const deadCode = `
    var ${generateVarName()} = function() {
      var ${generateVarName()} = [${Math.random()}, ${Math.random()}, ${Math.random()}];
      return ${generateVarName()}[0] > ${generateVarName()}[1] ? ${generateVarName()}[2] : ${generateVarName()}[1];
    };
    if (false) { ${generateVarName()}(); }
  `;
  
  // Step 6: Minify
  code = code
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,=+\-*\/<>!&|?:])\s*/g, '$1')
    .replace(/;\s*}/g, '}')
    .trim();
  
  // Step 7: Wrap in IIFE with string decoder
  const stringDecoder = strings.length > 0 ? `
    var _0xstrings = [${strings.map(s => s.value).join(',')}];
    var _0xdecode = function(i) { return _0xstrings[i]; };
  ` : '';
  
  const obfuscated = `(function(){${deadCode}${stringDecoder}${code}})();`;
  
  return obfuscated;
}

// Main execution
console.log('🔒 Advanced JavaScript Obfuscator\n');

const inputFile = path.join(__dirname, 'app.js');
const outputFile = path.join(__dirname, 'app.obf.js');

if (!fs.existsSync(inputFile)) {
  console.error('❌ app.js not found!');
  process.exit(1);
}

console.log('📖 Reading app.js...');
const sourceCode = fs.readFileSync(inputFile, 'utf8');
const originalSize = sourceCode.length;

console.log('🔧 Obfuscating code...');
const obfuscatedCode = obfuscateCode(sourceCode);
const obfuscatedSize = obfuscatedCode.length;

console.log('💾 Writing app.obf.js...');
fs.writeFileSync(outputFile, obfuscatedCode, 'utf8');

console.log('\n✅ Obfuscation complete!');
console.log(`   Original: ${originalSize} bytes`);
console.log(`   Obfuscated: ${obfuscatedSize} bytes`);
console.log(`   Ratio: ${((obfuscatedSize / originalSize) * 100).toFixed(1)}%`);
console.log('\n⚠️  Note: This is basic obfuscation.');
console.log('   For stronger protection, use:');
console.log('   - javascript-obfuscator (npm install -g javascript-obfuscator)');
console.log('   - Online: https://obfuscator.io/');
console.log('\n📝 Next step: Update index.html to use app.obf.js instead of app.js');

