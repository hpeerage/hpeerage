const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression()); // Gzip compression
app.use(morgan('combined')); // Better logging
app.use(express.json()); // Body parser

// Static Files (Serve the root of this directory)
const webPath = __dirname;
app.use(express.static(webPath));

// Health Check Endpoint for Monitoring/Gabia
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// GitHub Config Endpoint for Local Development
app.get('/api/config', (req, res) => {
    const fs = require('fs');
    const tokenPath = path.join(__dirname, '..', 'github_token');
    
    let token = null;
    if (fs.existsSync(tokenPath)) {
        token = fs.readFileSync(tokenPath, 'utf8').trim();
    }
    
    res.json({
        GITHUB_TOKEN: token,
        ENV: 'LOCAL'
    });
});

// Fallback for SPA or just to handle specific routes if needed
app.get('*', (req, res) => {
    res.sendFile(path.join(webPath, 'index.html'));
});

// Server Listen
app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`🚀 Hpeerage Server started on port ${PORT}`);
    console.log(`📂 Serving static files from: ${webPath}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`==========================================`);
});
