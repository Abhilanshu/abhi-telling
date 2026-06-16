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

    const styles = await page.evaluate(() => {
      const bodyStyle = window.getComputedStyle(document.body);
      const canvas = document.querySelector('canvas');
      const canvasStyle = canvas ? window.getComputedStyle(canvas) : null;
      const htmlStyle = window.getComputedStyle(document.documentElement);
      
      return {
        bodyBg: bodyStyle.backgroundColor,
        bodyBgImg: bodyStyle.backgroundImage,
        canvasBg: canvasStyle ? canvasStyle.backgroundColor : null,
        canvasBgImg: canvasStyle ? canvasStyle.backgroundImage : null,
        htmlBg: htmlStyle.backgroundColor,
        htmlBgImg: htmlStyle.backgroundImage
      };
    });

    console.log("Original site background styles:", styles);

    // Scroll to midpoint and check again
    await page.evaluate(() => window.scrollTo(0, 1800));
    await new Promise(r => setTimeout(r, 2000));

    const stylesMid = await page.evaluate(() => {
      const bodyStyle = window.getComputedStyle(document.body);
      const canvas = document.querySelector('canvas');
      const canvasStyle = canvas ? window.getComputedStyle(canvas) : null;
      return {
        bodyBg: bodyStyle.backgroundColor,
        bodyBgImg: bodyStyle.backgroundImage,
        canvasBg: canvasStyle ? canvasStyle.backgroundColor : null,
        canvasBgImg: canvasStyle ? canvasStyle.backgroundImage : null,
        bodyClass: document.body.className
      };
    });

    console.log("Original site midpoint background styles:", stylesMid);

    await browser.close();
  } catch (error) {
    console.error("Error:", error);
  }
})();
