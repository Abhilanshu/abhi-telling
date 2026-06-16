const puppeteer = require('puppeteer');

async function run() {
  console.log("Launching Puppeteer...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  console.log("Navigating to https://storytelling.noomoagency.com/ ...");
  try {
    await page.goto('https://storytelling.noomoagency.com/', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log("Navigation successful. Waiting...");
    await new Promise(resolve => setTimeout(resolve, 6000));

    console.log("Clicking center to start...");
    await page.mouse.click(640, 360);
    await new Promise(resolve => setTimeout(resolve, 4000));

    const scrollVal = 3840;
    console.log(`Scrolling to ${scrollVal} via mouse.wheel...`);
    
    // Scroll in steps
    let currentY = 0;
    while (currentY < scrollVal) {
      const step = 80;
      await page.mouse.wheel({ deltaY: step });
      currentY += step;
      await new Promise(resolve => setTimeout(resolve, 20));
    }

    // Wait 2.5s for animations to settle
    await new Promise(resolve => setTimeout(resolve, 2500));

    const screenshotPath = `C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\58d25d46-ff97-42af-8fde-91e5a3bd458e\\scroll_2400_original.png`;
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
