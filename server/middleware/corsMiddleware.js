const cors = require('cors');


const corsOptions = {
    origin: 'http://localhost:3600',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Authorization'],



};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
