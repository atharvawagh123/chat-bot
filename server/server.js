require('dotenv').config(); // For loading environment variables from .env file
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 8000; // You can choose any port

// Middleware to parse JSON bodies
app.use(express.json());
// Use CORS middleware
app.use(cors());
// Initialize the GoogleGenerativeAI instance
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Endpoint to handle content generation requests
app.post('/generate', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // Generate content using the model
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log(result);
        // Function to parse special formatting
        const formatText = (text) => {
            // Replace ## with <h2> tags
            let formattedText = text.replace(/^## (.+)$/gm, '<h2>$1</h2>');

            // Replace **text** with <strong> tags
            formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

            // Replace * text with <li> tags inside a <ul>
            formattedText = formattedText
                .split('\n') // Split the content into lines
                .filter(line => line.trim()) // Remove empty lines
                .map(line => {
                    if (line.startsWith('* ')) {
                        // Replace * with <li> tag
                        return `<li>${line.substring(2).trim()}</li>`;
                    }
                    // Return plain text
                    return line.trim();
                })
                .reduce((acc, line) => {
                    // Wrap all list items in a <ul> tag
                    if (line.startsWith('<li>')) {
                        if (!acc.endsWith('</ul>') && acc.includes('<ul>')) {
                            return acc + line;
                        }
                        return acc + (acc.includes('<ul>') ? line : `<ul>${line}`);
                    }
                    return acc + `<p>${line}</p>`; // Wrap non-list items in <p> tags
                }, '')
                .concat('</ul>'); // Close the <ul> tag

            return `<div style="padding: 10px; line-height: 1.6;">${formattedText}</div>`;
        };

        // Structure the response into a more organized HTML format
        const htmlResponse = formatText(responseText);

        // Send the structured HTML response
        res.json({ text: htmlResponse });
    } catch (error) {
        // Handle errors
        console.error('Error generating content:', error);
        res.status(500).json({ error: 'Error generating content' });
    }


});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
