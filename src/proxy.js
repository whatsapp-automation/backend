// Simple proxy server to forward requests to the MCP server
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// List of potential MCP server URLs to try
const MCP_URLS = [
    "http://127.0.0.1:8081/v1/execute",
    "http://localhost:8081/v1/execute",
    "http://host.docker.internal:8081/v1/execute",
    "http://172.17.0.1:8081/v1/execute"
];

// Forward all requests to the MCP server
app.post('/proxy-mcp', async (req, res) => {
    console.log('Received request to proxy to MCP server');
    console.log('Request body:', JSON.stringify(req.body));
    
    // Try each URL until one works
    for (const url of MCP_URLS) {
        try {
            console.log(`Trying ${url}...`);
            const response = await axios.post(url, req.body, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });
            
            console.log(`Success with ${url}`);
            return res.status(response.status).json(response.data);
        } catch (error) {
            console.error(`Failed with ${url}:`, error.message);
            // Continue to the next URL
        }
    }
    
    // If all URLs fail, return an error
    console.error('All connection attempts failed');
    return res.status(500).json({ error: 'Could not connect to MCP server' });
});

// Start the server
const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
}); 