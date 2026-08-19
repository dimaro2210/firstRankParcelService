const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, 'src', 'pages', 'Admin.tsx');
let content = fs.readFileSync(adminPath, 'utf8');

// Replace main container background
content = content.replace('bg-[#0B2B26] min-h-screen relative overflow-hidden font-sans pb-24 flex', 'bg-firstrank-cream min-h-screen relative overflow-hidden font-sans pb-24 flex');

// Leave sidebar as dark, but change the main content area classes.
// We need to be careful not to replace text-white inside the sidebar or header.
// The sidebar ends at `</nav>` around line 350. The header ends at `</header>` around line 400.
// So let's split the file into three parts: imports/sidebar/header, main content, and sub-components.
const headerEndIndex = content.indexOf('<div className="max-w-6xl w-full mx-auto');
const subComponentsIndex = content.indexOf('// ── Sub-components');

let part1 = content.substring(0, headerEndIndex);
let part2 = content.substring(headerEndIndex, subComponentsIndex);
let part3 = content.substring(subComponentsIndex);

// Refactor part2 (main content) and part3 (sub-components) to light theme:
function lightTheme(str) {
  return str
    .replace(/bg-white\/5/g, 'bg-white shadow-sm border-gray-200 text-firstrank-deep')
    .replace(/bg-white\/10/g, 'bg-white shadow-xl border-gray-200')
    .replace(/border-white\/10/g, 'border-gray-200')
    .replace(/border-white\/20/g, 'border-gray-300')
    .replace(/text-white\/30/g, 'text-gray-400')
    .replace(/text-white\/40/g, 'text-gray-500')
    .replace(/text-white\/50/g, 'text-gray-500')
    .replace(/text-white/g, 'text-firstrank-deep')
    // Fix specific buttons that might be broken by text-firstrank-deep replacement:
    .replace(/text-firstrank-deep font-bold hover:bg-\[\#D38215\]/g, 'text-white font-bold hover:bg-[#D38215]')
    .replace(/bg-\[\#F59A25\] text-firstrank-deep/g, 'bg-[#F59A25] text-white')
    .replace(/bg-blue-500\/20/g, 'bg-blue-50')
    .replace(/text-blue-300/g, 'text-blue-600')
    .replace(/border-blue-500\/30/g, 'border-blue-200')
    .replace(/bg-red-500\/20/g, 'bg-red-50')
    .replace(/text-red-300/g, 'text-red-600')
    .replace(/border-red-500\/30/g, 'border-red-200')
    .replace(/bg-green-500\/20/g, 'bg-green-50')
    .replace(/text-green-300/g, 'text-green-600')
    .replace(/border-green-500\/30/g, 'border-green-200')
    .replace(/bg-purple-500\/20/g, 'bg-purple-50')
    .replace(/text-purple-300/g, 'text-purple-600')
    .replace(/border-purple-500\/30/g, 'border-purple-200')
    .replace(/bg-cyan-500\/20/g, 'bg-cyan-50')
    .replace(/text-cyan-300/g, 'text-cyan-600')
    .replace(/border-cyan-500\/30/g, 'border-cyan-200')
    // Inputs inside part2
    .replace(/text-\[\#8EB69B\]/g, 'text-gray-500')
    .replace(/bg-\[\#123d36\]/g, 'bg-white');
}

part2 = lightTheme(part2);
part3 = lightTheme(part3);

// In part1, just update the shared styles
part1 = part1.replace(
  'const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F59A25] transition-colors";',
  'const inp = "w-full bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 text-firstrank-deep focus:outline-none focus:border-[#F59A25] transition-colors";'
);
part1 = part1.replace(
  'const sel = "w-full bg-[#123d36] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F59A25] transition-colors";',
  'const sel = "w-full bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 text-firstrank-deep focus:outline-none focus:border-[#F59A25] transition-colors";'
);
part1 = part1.replace(
  'const lbl = "block text-[#8EB69B] text-[13px] font-bold uppercase tracking-wider mb-2";',
  'const lbl = "block text-gray-500 text-[13px] font-bold uppercase tracking-wider mb-2";'
);

fs.writeFileSync(adminPath, part1 + part2 + part3, 'utf8');
console.log('Refactored Admin.tsx to light theme');
