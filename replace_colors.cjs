const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, callback);
    else callback(p);
  });
}

const replacements = [
  // Class replacements for specific hex colors
  { from: /bg-\[#0662BB\]/g, to: 'bg-firstrank-deep' },
  { from: /text-\[#0662BB\]/g, to: 'text-firstrank-deep' },
  { from: /border-\[#0662BB\]/g, to: 'border-firstrank-deep' },
  { from: /ring-\[#0662BB\]/g, to: 'ring-firstrank-deep' },
  
  { from: /bg-\[#10B981\]/g, to: 'bg-firstrank-orange' },
  { from: /text-\[#10B981\]/g, to: 'text-firstrank-orange' },
  { from: /border-\[#10B981\]/g, to: 'border-firstrank-orange' },
  { from: /ring-\[#10B981\]/g, to: 'ring-firstrank-orange' },
  { from: /#10B981/g, to: 'var(--firstrank-orange)' },

  { from: /bg-\[#F5F5F0\]/g, to: 'bg-firstrank-cream' },
  { from: /text-\[#F5F5F0\]/g, to: 'text-firstrank-cream' },
  { from: /border-\[#F5F5F0\]/g, to: 'border-firstrank-cream' },
  
  { from: /bg-\[#EBF5FF\]/g, to: 'bg-firstrank-mint' },
  { from: /bg-\[#E6F4F1\]/g, to: 'bg-firstrank-mint' },

  { from: /hover:bg-yellow-500/g, to: 'hover:bg-firstrank-amber' },
  { from: /bg-yellow-500/g, to: 'bg-firstrank-amber' },
  
  // General fallback for hardcoded colors in style objects
  { from: /#0662BB/g, to: 'var(--firstrank-deep)' },
  { from: /#F5F5F0/g, to: 'var(--firstrank-cream)' },
];

walk(srcDir, (p) => {
  if (p.endsWith('.tsx') || p.endsWith('.ts')) {
    let content = fs.readFileSync(p, 'utf8');
    let original = content;
    replacements.forEach(r => {
      content = content.replace(r.from, r.to);
    });
    if (content !== original) {
      fs.writeFileSync(p, content, 'utf8');
      console.log('Updated', p);
    }
  }
});
