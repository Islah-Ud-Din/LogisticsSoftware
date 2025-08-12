// --------------------------------------------------------------------------------------------------------------------
// Custom Middleware Setup
// --------------------------------------------------------------------------------------------------------------------
const fs = require('fs');

const customMiddle = (req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const now = new Date();
    const timestamp = now.toLocaleString();
    const log = `${timestamp}: ${req.method} : ${req.url}\n`;

    fs.appendFile('logs/log.txt', log, (err) => {
        if (err) console.error('Failed to write log:', err);
    });

    next();
};

module.exports = customMiddle;
