const puppeteer = require('puppeteer');
const path = require('path');

async function run() {
  console.log("Launching Puppeteer...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  console.log("Navigating to http://localhost:5173/ ...");
  try {
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log("Navigation successful. Waiting for #tap-to-explore-btn...");
    await page.waitForSelector('#tap-to-explore-btn', { timeout: 10000 });
    console.log("Clicking #tap-to-explore-btn...");
    await page.click('#tap-to-explore-btn');
    await new Promise(resolve => setTimeout(resolve, 2000));

    const scrolls = [0, 5000, 10000, 15000, 18000, 22000, 26000];
    for (let i = 0; i < scrolls.length; i++) {
      const scrollVal = scrolls[i];
      console.log(`Scrolling to ${scrollVal}...`);
      await page.evaluate((val) => {
        if (window.scrollToVirtual) {
          window.scrollToVirtual(val);
        }
      }, scrollVal);

      // Wait 1s for animation and layout to settle
      await new Promise(resolve => setTimeout(resolve, 1000));

      const screenshotPath = `C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\2a080132-c6fd-4c1e-bc79-f22d1f7589b2\\scratch\\scroll_${scrollVal}.png`;
      await page.screenshot({ path: screenshotPath });
      console.log(`Saved screenshot for scroll ${scrollVal} to ${screenshotPath}`);
    }

  } catch (err) {
    console.error("Error during execution:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
}

run();
