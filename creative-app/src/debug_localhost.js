import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  try {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Listen to console events
    page.on('console', msg => {
      console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
    });

    console.log("Navigating to http://localhost:5173/ ...");
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });


    console.log("Waiting 8 seconds for page loading...");
    await new Promise(r => setTimeout(r, 8000));

    // Click "TAP TO EXPLORE"
    console.log("Waiting for TAP TO EXPLORE button to render...");
    await page.waitForSelector('#tap-to-explore-btn', { timeout: 20000 });
    
    // Take initial screenshot of start screen
    const pathStart = path.join("C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\58d25d46-ff97-42af-8fde-91e5a3bd458e", "debug_start.png");
    await page.screenshot({ path: pathStart });
    console.log("Saved debug_start.png");

    console.log("Clicking TAP TO EXPLORE...");
    await page.click('#tap-to-explore-btn');
    console.log("Button clicked!");

    // Wait 4 seconds for reveal animation and transition to complete
    await new Promise(r => setTimeout(r, 4000));

    const pathActive = path.join("C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\58d25d46-ff97-42af-8fde-91e5a3bd458e", "debug_active.png");
    await page.screenshot({ path: pathActive });
    console.log("Saved debug_active.png");

    // Scroll down to crystal section (about 3300px)
    console.log("Scrolling to 3300px...");
    await page.evaluate(() => {
      window.scrollToVirtual(3300);
    });



    // Wait 2 seconds
    await new Promise(r => setTimeout(r, 2000));

    const pathCrystals = path.join("C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\58d25d46-ff97-42af-8fde-91e5a3bd458e", "debug_crystals.png");
    await page.screenshot({ path: pathCrystals });
    console.log("Saved debug_crystals.png");

    await browser.close();
    console.log("Debug script finished.");
  } catch (error) {
    console.error("Error occurred:", error);
    process.exit(1);
  }
})();
