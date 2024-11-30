require('dotenv').config();  // Load environment variables from .env
const express = require('express');  // Import Express for creating the server
const axios = require('axios');  // Import Axios for making API requests
const app = express();  // Initialize an Express app

// Use JSON middleware to parse incoming JSON requests
app.use(express.json());

// Load API keys from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Endpoint to generate a response using OpenAI API
app.post('/generate', async (req, res) => {
    try {
        // Extract the prompt from the request body
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).send({ error: "Prompt is required" });
        }

        // Use Axios to send a request to the OpenAI API
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: 'text-davinci-003', // Model to use (e.g., 'text-davinci-003')
                prompt: prompt,
                max_tokens: 100,  // Number of tokens for the response
                temperature: 0.9  // Creativity of the response
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Extract and send back the response from OpenAI
        res.send({ response: response.data.choices[0].text.trim() });
    } catch (error) {
        console.error('Error fetching OpenAI response:', error);
        res.status(500).send({ error: 'Failed to generate response' });
    }
});

// Start the server on port 5000 (or the port specified in environment variables)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
