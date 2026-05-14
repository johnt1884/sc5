const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Load the page
  const filePath = 'file://' + path.resolve('sc5.html');
  await page.goto(filePath);

  // Check for console errors
  page.on('console', msg => {
    console.log(`PAGE LOG: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.log(`PAGE ERROR: ${err.toString()}`);
  });

  // Wait for the list to load
  await page.waitForSelector('button:has-text("Edit")');

  console.log('Clicking Edit button...');
  const editButton = await page.locator('button:has-text("Edit")').first();
  await editButton.click();

  // Wait a bit to see if editor opens
  await page.waitForTimeout(1000);

  const isEditorVisible = await page.isVisible('#video-editor');
  console.log(`Is editor visible? ${isEditorVisible}`);

  await page.screenshot({ path: 'editor_click_test.png' });

  await browser.close();
})();
