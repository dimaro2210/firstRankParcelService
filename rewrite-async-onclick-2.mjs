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

  // Find all onClick={() => { ... await ... }}
  let modified = true;
  while (modified) {
    modified = false;
    content = content.replace(/onClick=\{\(\) => \{([^{}]*await[^{}]*)\}\}/g, (match, body) => {
      modified = true;
      return `onClick={async () => {${body}}}`;
    });
  }
  
  // It might fail on nested braces, so let's just do a string replacement for the specific ones
  content = content.replace(/onClick=\{\(\) => \{\n(.*)const bill/g, 'onClick={async () => {\n$1const bill');
  content = content.replace(/onClick=\{\(\) => \{\n(.*)await saveDeposit/g, 'onClick={async () => {\n$1await saveDeposit');
  content = content.replace(/onClick=\{\(\) => \{\n(.*)await deleteBill/g, 'onClick={async () => {\n$1await deleteBill');
  
  fs.writeFileSync(path, content, 'utf8');
});

console.log("Migration script applied.");
