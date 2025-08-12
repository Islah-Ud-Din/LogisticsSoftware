// --------------------------------------------------------------------------------------------------------------------
// Database Connection Setup (PostgreSQL)
// --------------------------------------------------------------------------------------------------------------------
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const DbConnection = async () => {
    let client;
    try {
        client = await pool.connect();
        console.log('✅ Connected to PostgreSQL database');
    } catch (err) {
        console.error('❌ Error connecting to database', err.stack);
    } finally {
        if (client) client.release();
    }
};

module.exports = { pool, DbConnection };
