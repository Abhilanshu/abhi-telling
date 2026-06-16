import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    await page.goto('https://storytelling.noomoagency.com/', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 4000));

    // Get total scroll height
    const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log("Total scroll height of original:", totalHeight);

    // Sample backgrounds every 1000px
    for (let scrollY = 0; scrollY <= totalHeight; scrollY += 1000) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await new Promise(r => setTimeout(r, 500));
      
      const info = await page.evaluate(() => {
        const bodyStyle = window.getComputedStyle(document.body);
        const footer = document.querySelector('footer');
        const footerStyle = footer ? window.getComputedStyle(footer) : null;
        const release = document.querySelector('.release-spirit');
        const releaseStyle = release ? window.getComputedStyle(release) : null;
        
        return {
          scrollY: window.scrollY,
          bodyBg: bodyStyle.backgroundColor,
          bodyClass: document.body.className,
          footerBg: footerStyle ? footerStyle.backgroundColor : 'not found',
          releaseBg: releaseStyle ? releaseStyle.backgroundColor : 'not found'
        };
      });
      console.log(`Scroll ${scrollY}px:`, info);
    }

    await browser.close();
  } catch (error) {
    console.error("Error:", error);
  }
})();
