require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { host } = require('pg/lib/defaults');

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

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'islahuddin795@gmail.com',
        pass: 'hutj oeqz lykq iont', // Use the app password generated for SMTP
    },
});

// API Register Endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send('Email and password are required');
        }

        // Check if user already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomBytes(3).toString('hex');
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        await pool.query('INSERT INTO users (email, password, otp, otp_expiry, is_verified) VALUES ($1, $2, $3, $4, $5)', [
            email,
            hashedPassword,
            otp,
            otpExpiry,
            false,
        ]);

        // Send OTP email
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Registration successful. Check your email for the OTP.' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Server error');
    }
});

// API Verify Token Endpoint
app.post('/api/verify-otp', async (req, res) => {
    const { email, token } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).send('User not found');
        }

        if (user.otp !== token) {
            return res.status(400).send('Invalid OTP');
        }

        const currentTime = new Date();
        if (currentTime > new Date(user.otp_expiry)) {
            return res.status(400).send('OTP has expired');
        }

        // OTP is valid
        await pool.query('UPDATE users SET is_verified = $1, otp = NULL, otp_expiry = NULL WHERE email = $2', [true, email]);
        res.status(200).json({ message: 'Email verified successfully. Registration complete.' });
    } catch (err) {
        console.error('Error:', err.message);
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

        const token = jwt.sign(
            { userId: user.id, email: user.email }, // Payload
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // If authentication is successful, return the user data (or a token)
        res.status(200).json({
            userId: user.id,
            email: user.email,
            password: user.password,
            token: token,
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
