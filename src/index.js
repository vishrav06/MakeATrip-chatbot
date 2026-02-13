const express = require('express');
const cors = require('cors');

require('dotenv').config();

const chatRoutes = require('./routes/chat');
const errorHandler = require('./middleware/errorHandler');


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());

// HealthCheck Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'MakeATrip-Chatbot'
    })
})


// chat route
app.use('/api/chat', chatRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    })
})

// Global Error
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`🚀 MakeATrip Chatbot Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat/message`);
});