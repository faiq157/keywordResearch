const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

async function scrapeWebsite(url) {
  try {
    // Use Puppeteer to handle dynamic content
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const content = await page.evaluate(() => {
      let content = '';
      // Modify this selector based on the website's HTML structure
      const elements = document.querySelectorAll('h1, h2, h3, p,div,span,li,td');
      elements.forEach(element => {
        content += element.innerText + ' ';
      });
      return content;
    });

    await browser.close();

    if (!content.trim()) {
      throw new Error('No content found on the page');
    }

    return content.trim();
  } catch (error) {
    console.error('Error fetching the website:', error.message);
    return null;
  }
}

module.exports = scrapeWebsite;
