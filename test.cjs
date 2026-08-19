const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:5173/tracking', { waitUntil: 'networkidle0' });
  
  await page.type('input[placeholder="Enter tracking number (e.g. 1Z999...)"]', '1Z999');
  
  const [button] = await page.$x("//button[contains(., 'Track Now')]");
  if (button) {
    console.log("Found Track button, clicking...");
    await button.click();
    await page.waitForTimeout(2000);
    console.log("Wait complete.");
  } else {
    console.log("Could not find Track button");
  }
  
  await browser.close();
})();
