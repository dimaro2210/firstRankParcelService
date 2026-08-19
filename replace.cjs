const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function replaceInFile(filePath) {
  if (!filePath.match(/\.(tsx|ts|html)$/)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/(?<![-a-zA-Z0-9_])FIRSTRANK(?![a-zA-Z0-9_-])/g, 'FIRSTRANK PARCEL')
    .replace(/(?<![-a-zA-Z0-9_])Firstrank(?![a-zA-Z0-9_-])/g, 'Firstrank Parcel')
    .replace(/(?<![-a-zA-Z0-9_])firstrank(?![a-zA-Z0-9_-])/g, 'firstrank logix');
    
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated', filePath);
  }
}

walkDir('./src', replaceInFile);
replaceInFile('./index.html');
