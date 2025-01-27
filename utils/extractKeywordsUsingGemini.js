// extractKeywordsUsingGemini.js
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function extractKeywordsUsingGemini(content) {
  try {
    // Initialize GoogleGenerativeAI client with your API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Select the generative model (gemini-1.5-flash in this case)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the prompt that you want to send to Gemini for keyword extraction
    const prompt = `
      As an SEO expert, analyze the following content and identify the primary and secondary keywords.
      primary keyword can be find in the url slug and the title of the page.The primary keyword density should be 1-2% of the total content.
      primary keyword should be used in the first paragraph of the content which include h1.
      the primary keyword in the website use only once in the content.


      Primary keywords should be the most important and relevant terms for search engine optimization.
      Secondary keywords should be closely related to the primary keywords and help improve search relevance.

      Content:
      "${content}"

      Please return the primary keywords and secondary keywords in the following JSON format:

      {
        "primaryKeywords": ["keyword1"],
        "secondaryKeywords": ["keywordA", "keywordB", "keywordC"]
      }
    `;

    // Call the Gemini API to generate the content based on the prompt
    const result = await model.generateContent(prompt);

    // Log the full response for debugging purposes
    console.log('Full Response:', result.response.text());

    // Clean the result text to remove backticks and any unwanted formatting
    const cleanedText = result.response.text()
      .replace(/```json|\n|```/g, '') // Remove ```json, newlines, and closing ```
      .trim(); // Clean up any leading or trailing spaces

    // Parse the cleaned response as JSON
    const keywords = JSON.parse(cleanedText);

    return keywords;
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    if (error.response) {
      console.error('Full Error Details:', error.response.data);
    }
    return null;
  }
}

module.exports = extractKeywordsUsingGemini;
