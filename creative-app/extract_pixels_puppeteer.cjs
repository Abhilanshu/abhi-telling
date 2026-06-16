const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const base64Str = "data:image/png;base64,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";

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  await page.setContent(`
    <html>
      <body>
        <canvas id="canvas" width="1024" height="2"></canvas>
      </body>
    </html>
  `);

  const rgbData = await page.evaluate(async (base64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, 1024, 1);
        const data = imgData.data;
        const rgb = [];
        for (let i = 0; i < data.length; i += 4) {
          rgb.push(data[i], data[i+1], data[i+2]);
        }
        resolve(rgb);
      };
      img.src = base64;
    });
  }, base64Str);

  await browser.close();

  fs.writeFileSync(
    'C:/Users/ASUS/.gemini/antigravity/brain/58d25d46-ff97-42af-8fde-91e5a3bd458e/scratch/colorsMap_pixels.json',
    JSON.stringify(rgbData)
  );
  console.log(`Successfully extracted ${rgbData.length / 3} RGB pixels!`);
})();
