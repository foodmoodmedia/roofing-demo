const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// Parse arguments
const args = process.argv.slice(2);
let configPath = 'config/base.json';
let outDir = 'dist';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--config') configPath = args[i + 1];
  if (args[i] === '--out') outDir = args[i + 1];
}

console.log(`\n🚀 Starting Handlebars build process...`);
console.log(`📄 Using config: ${configPath}`);
console.log(`📁 Output directory: ${outDir}\n`);

// Load Context
const rawConfig = fs.readFileSync(path.join(__dirname, configPath), 'utf8');
const context = JSON.parse(rawConfig);

// Register Partials
function registerPartials(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file.endsWith('.html') || file.endsWith('.hbs')) {
      const name = file.replace(/\.(html|hbs)$/, '');
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      Handlebars.registerPartial(name, content);
      console.log(`🔹 Registered partial: ${name}`);
    }
  });
}

registerPartials(path.join(__dirname, 'components'));
registerPartials(path.join(__dirname, 'sections'));

// Create Output Directory
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Build Pages
const pagesDir = path.join(__dirname, 'pages');
if (fs.existsSync(pagesDir)) {
  const pages = fs.readdirSync(pagesDir).filter(file => file.endsWith('.html') || file.endsWith('.hbs'));

  pages.forEach(page => {
    const pagePath = path.join(pagesDir, page);
    const content = fs.readFileSync(pagePath, 'utf8');
    
    // Compile with Handlebars
    const template = Handlebars.compile(content);
    const result = template(context);

    // Write output
    const outputFileName = page.replace('.hbs', '.html');
    fs.writeFileSync(path.join(outDir, outputFileName), result);
    console.log(`✅ Built page: ${outputFileName}`);
  });
}

// Copy Static Assets
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDirSync(path.join(__dirname, 'styles'), path.join(outDir, 'css'));
copyDirSync(path.join(__dirname, 'assets'), path.join(outDir, 'images'));

if (fs.existsSync(path.join(__dirname, 'js'))) {
  copyDirSync(path.join(__dirname, 'js'), path.join(outDir, 'js'));
}

console.log(`\n🎉 Build complete! Site generated in -> ${outDir}\n`);
