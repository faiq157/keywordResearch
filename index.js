// app.js
const express = require('express');
const scrapeWebsite = require('./utils/scrapeWebsite');
const extractKeywordsUsingGemini = require('./utils/extractKeywordsUsingGemini');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to scrape a website and extract keywords
app.post('/extract-keywords', async (req, res) => {
  const { url } = req.body; // Expecting the URL in the request body

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Step 1: Scrape the website
    const content = await scrapeWebsite(url);

    if (!content) {
      return res.status(500).json({ error: 'Failed to scrape the website' });
    }

    // Step 2: Extract keywords using Gemini API
    const keywords = await extractKeywordsUsingGemini(content);
    if (!keywords) {
      return res.status(500).json({ error: 'Failed to extract keywords' });
    }

    // Step 3: Send the extracted keywords as the response
    res.json({ keywords });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
