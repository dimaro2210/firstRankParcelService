const fs = require('fs');

async function scrape() {
  try {
    const res = await fetch('https://www.ups.com/us/en/home');
    const html = await res.text();
    
    // Extract images
    const imgRegex = /<img[^>]+src="([^">]+)"/gi;
    let images = new Set();
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      images.add(match[1]);
    }
    
    // Extract h1, h2
    const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
    let h1s = [];
    while ((match = h1Regex.exec(html)) !== null) {
      h1s.push(match[1].replace(/<[^>]+>/g, '').trim());
    }
    
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
    let h2s = [];
    while ((match = h2Regex.exec(html)) !== null) {
      h2s.push(match[1].replace(/<[^>]+>/g, '').trim());
    }

    const output = {
      images: Array.from(images),
      h1: h1s.filter(Boolean),
      h2: h2s.filter(Boolean)
    };
    
    fs.writeFileSync('ups_data.json', JSON.stringify(output, null, 2));
    console.log("Extracted data saved to ups_data.json");
  } catch (err) {
    console.error(err);
  }
}

scrape();
