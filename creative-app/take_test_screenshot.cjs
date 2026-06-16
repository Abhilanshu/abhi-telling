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
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log("Navigation successful. Waiting for #tap-to-explore-btn...");
    await page.waitForSelector('#tap-to-explore-btn', { timeout: 10000 });
    console.log("Clicking #tap-to-explore-btn...");
    await page.click('#tap-to-explore-btn');
    await new Promise(resolve => setTimeout(resolve, 2000));

    const scrollVal = 3840;
    console.log(`Scrolling to ${scrollVal}...`);
    await page.evaluate((val) => {
      if (window.scrollToVirtual) {
        window.scrollToVirtual(val);
      }
    }, scrollVal);

    // Wait 1.5s for animations to settle
    await new Promise(resolve => setTimeout(resolve, 1500));

    const screenshotPath = `C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\58d25d46-ff97-42af-8fde-91e5a3bd458e\\scroll_2400_after_skinning.png`;
    await page.screenshot({ path: screenshotPath });
    console.log(`Saved screenshot to ${screenshotPath}`);

  } catch (err) {
    console.error("Error during execution:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
}

run();
