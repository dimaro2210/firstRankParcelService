import fs from 'fs';

const pages = [
  'c:/Users/David/Desktop/FIRSTRANK/Website-Mirror/src/pages/Admin.tsx',
  'c:/Users/David/Desktop/FIRSTRANK/Website-Mirror/src/pages/Dashboard.tsx',
  'c:/Users/David/Desktop/FIRSTRANK/Website-Mirror/src/pages/Billing.tsx',
  'c:/Users/David/Desktop/FIRSTRANK/Website-Mirror/src/pages/Tracking.tsx'
];

pages.forEach(path => {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');

  content = content.replace(/onClick=\{\(\) => \{(\s*)await/g, 'onClick={async () => {$1await');
  content = content.replace(/onClick=\{\(\) => await/g, 'onClick={async () => await');
  
  fs.writeFileSync(path, content, 'utf8');
});

console.log("Migration script applied.");
