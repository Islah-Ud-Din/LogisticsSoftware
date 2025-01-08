require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    })
);

app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error connecting to database', err.stack);
    }
    console.log('Connected to PostgreSQL database');
    release();
});

// Example route: Fetch all users
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Example route: Add a user

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body; // Destructure email and password from req.body

        if (!email || !password) {
            return res.status(400).send('Email and password are required');
        }

        console.log('Received email:', email);
        console.log('Received password:', password);

        // Hash the password before inserting into the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Query to insert user data into the 'login' table
        const result = await pool.query('INSERT INTO login (email, password) VALUES ($1, $2) RETURNING email,password', [
            email,
            hashedPassword,
        ]);

        if (result.rows.length === 0) {
            return res.status(400).send('Error inserting user');
        }

        const user = result.rows[0];

        // If authentication is successful, return the user data (or a token)
        res.status(200).json({
            userId: user.id,
            email: user.email,
            password: user.password,
        });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Server error');
    }
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
