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

const textReplacements = [
  { from: /(?<!md:)text-\[56px\](?! md:)/g, to: 'text-[32px] md:text-[56px]' },
  { from: /(?<!md:)text-\[48px\](?! md:)/g, to: 'text-[28px] md:text-[48px]' },
  { from: /(?<!md:)text-\[40px\](?! md:)/g, to: 'text-[24px] md:text-[40px]' },
  { from: /(?<!md:)text-\[32px\](?! md:)/g, to: 'text-[24px] md:text-[32px]' },
  { from: /(?<!md:)text-\[28px\](?! md:)/g, to: 'text-[20px] md:text-[28px]' },
];

walk(srcDir, (p) => {
  if (p.endsWith('.tsx') || p.endsWith('.ts')) {
    let content = fs.readFileSync(p, 'utf8');
    let original = content;
    
    // First, undo any double replacements if we ran this script before poorly
    // e.g., if we had `text-[24px] md:text-[32px] md:text-[56px]`
    content = content.replace(/text-\[\d+px\]\s+md:text-\[\d+px\]\s+md:text-\[\d+px\]/g, (match) => {
       const parts = match.split(' ');
       return parts[0] + ' ' + parts[2]; // keep first and last
    });

    textReplacements.forEach(r => {
      content = content.replace(r.from, r.to);
    });

    if (content !== original) {
      fs.writeFileSync(p, content, 'utf8');
      console.log('Updated Text in', p);
    }
  }
});
