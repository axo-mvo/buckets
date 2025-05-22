require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
// Use a different port for backend API if Vite runs on 3000
// Or configure Vite to proxy API requests
const port = process.env.PORT || 3001; 
const API_URL = 'https://6bs4naw2sl.execute-api.eu-north-1.amazonaws.com/data/bucket/all';
const API_TOKEN = process.env.API_TOKEN;

if (!API_TOKEN) {
    console.error("Error: API_TOKEN environment variable not set.");
    process.exit(1);
}

// Middleware to serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// ALSO serve files from node_modules (needed for vis-timeline)
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// API endpoint to fetch bucket data
app.get('/api/buckets', async (req, res) => {
    // Add CORS header for development (Vite dev server runs on different port)
    res.header('Access-Control-Allow-Origin', '*'); // Allow any origin for simplicity, restrict in production
    try {
        console.log(`Fetching data from ${API_URL}`);
        const response = await axios.get(API_URL, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });
        console.log(`Successfully fetched ${response.data.length} buckets.`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching bucket data:', error.response ? error.response.status : error.message);
        res.status(error.response ? error.response.status : 500).json({ message: 'Failed to fetch bucket data' });
    }
});

// --- Static file serving for PRODUCTION only ---
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the Vite build output directory
    app.use(express.static(path.join(__dirname, 'dist')));

    // Catch-all to serve index.html for client-side routing
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
    if (process.env.NODE_ENV !== 'production') {
        console.log('Run `npm run dev` to start frontend dev server.');
    }
}); 