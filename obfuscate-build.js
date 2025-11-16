/**
 * Build script to obfuscate and minify CyberKit code
 * 
 * Usage:
 *   node obfuscate-build.js
 * 
 * This will create minified/obfuscated versions of your files
 */

const fs = require('fs');
const path = require('path');

// Simple minifier (basic - for production use a proper tool)
function minifyJS(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}();,=+\-*\/<>!&|?:])\s*/g, '$1') // Remove spaces around operators
    .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
    .trim();
}

// Simple CSS minifier
function minifyCSS(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around CSS syntax
    .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
    .trim();
}

// Simple HTML minifier
function minifyHTML(code) {
  return code
    .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/>\s+</g, '><') // Remove spaces between tags
    .trim();
}

console.log('🔒 CyberKit Obfuscation Build Script\n');

// Check if files exist
const files = {
  js: path.join(__dirname, 'app.js'),
  css: path.join(__dirname, 'style.css'),
  html: path.join(__dirname, 'index.html')
};

// Create dist folder
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy assets
const assetsDir = path.join(__dirname, 'assets');
const distAssetsDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  if (!fs.existsSync(distAssetsDir)) {
    fs.mkdirSync(distAssetsDir, { recursive: true });
  }
  // Copy images
  const imagesDir = path.join(assetsDir, 'images');
  const distImagesDir = path.join(distAssetsDir, 'images');
  if (fs.existsSync(imagesDir)) {
    if (!fs.existsSync(distImagesDir)) {
      fs.mkdirSync(distImagesDir, { recursive: true });
    }
    const images = fs.readdirSync(imagesDir);
    images.forEach(img => {
      fs.copyFileSync(
        path.join(imagesDir, img),
        path.join(distImagesDir, img)
      );
    });
    console.log('✅ Copied assets/images/');
  }
}

// Minify JavaScript
if (fs.existsSync(files.js)) {
  const jsCode = fs.readFileSync(files.js, 'utf8');
  const minified = minifyJS(jsCode);
  fs.writeFileSync(path.join(distDir, 'app.min.js'), minified);
  console.log(`✅ Minified app.js (${jsCode.length} → ${minified.length} bytes)`);
}

// Minify CSS
if (fs.existsSync(files.css)) {
  const cssCode = fs.readFileSync(files.css, 'utf8');
  const minified = minifyCSS(cssCode);
  fs.writeFileSync(path.join(distDir, 'style.min.css'), minified);
  console.log(`✅ Minified style.css (${cssCode.length} → ${minified.length} bytes)`);
}

// Minify HTML and update references
if (fs.existsSync(files.html)) {
  let htmlCode = fs.readFileSync(files.html, 'utf8');
  // Update script and link references
  htmlCode = htmlCode.replace('app.js', 'app.min.js');
  htmlCode = htmlCode.replace('style.css', 'style.min.css');
  const minified = minifyHTML(htmlCode);
  fs.writeFileSync(path.join(distDir, 'index.html'), minified);
  console.log(`✅ Minified index.html (${htmlCode.length} → ${minified.length} bytes)`);
}

// Copy .htaccess
const htaccess = path.join(__dirname, '.htaccess');
if (fs.existsSync(htaccess)) {
  fs.copyFileSync(htaccess, path.join(distDir, '.htaccess'));
  console.log('✅ Copied .htaccess');
}

console.log('\n✨ Build complete! Files are in the "dist" folder.');
console.log('⚠️  Note: This is basic minification. For stronger protection, use:');
console.log('   - javascript-obfuscator (npm install -g javascript-obfuscator)');
console.log('   - terser (npm install -g terser)');
console.log('   - webpack with obfuscation plugins');

