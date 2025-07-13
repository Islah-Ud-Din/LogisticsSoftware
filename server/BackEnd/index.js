require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { host } = require('pg/lib/defaults');
const calculations = require('./calulation');

const app = express();
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use(
    cors({
        origin: 'http://localhost:3000', // Allow frontend requests
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, // Allow cookies (for auth)
    })
);

app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test database connection
const DbConnection = async () => {
    let client;
    try {
        client = await pool.connect();
        console.log('Connected to PostgreSQL database');
    } catch (err) {
        console.error('Error connecting to database', err.stack);
    } finally {
        if (client) client.release();
    }
};


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
    const { firstName, lastName, email, password, country } = req.body;

    if (!firstName || !lastName || !email || !password || !country) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    try {
        const userExist = await pool.query('SELECT * FROM register_users WHERE email = $1', [email]);

        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: 'Email already in use!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomBytes(3).toString('hex');
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

        // Insert into DB with OTP + expiry + is_verified = false
        await pool.query(
            `INSERT INTO register_users
             (first_name, last_name, email, password, country, otp, otp_expiry, is_verified)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                firstName,
                lastName,
                email,
                hashedPassword,
                country,
                otp,
                otpExpiry,
                false,
            ]
        );

        // Send OTP
        const mailOptions = {
            from: 'islahuddin795@gmail.com',
            to: email,
            subject: 'Your Verification OTP',
            text: `Hi ${firstName},\n\nYour OTP for email verification is: ${otp}\n\nIt expires in 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Registration successful! Please verify your email.' });
    } catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});


// Example route: Add a user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists in the register_users table
        const userResult = await pool.query('SELECT * FROM register_users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            console.log('User not found');
            return res.status(404).json({ message: 'Account does not exist. Please create an account.' });
        }

        const user = userResult.rows[0];
        console.log('User found:', user); // Debugging output

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match:', passwordMatch); // Debugging output

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });

        const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

        // Optionally save the refresh token
        await pool.query('UPDATE register_users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);
        console.log('Updated refresh token for user:', user.id); // Debugging output

        // Set refresh token in HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            path: '/api/refresh-token',
        });

        // ✅ Return access token
        res.status(200).json({ accessToken });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


// API Verify Token Endpoint
app.post('/api/verify-otp', async (req, res) => {
    const { email, token } = req.body;

    console.log('Email received:', email); // Log email to verify input

    try {
        // Query to get the OTP and OTP expiry date from the DB
        const { rows } = await pool.query('SELECT otp, otp_expiry FROM register_users WHERE email = $1', [email]);

        if (rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = rows[0];

        console.log('User retrieved from DB:', user); // Log the user data for debugging

        // If OTP from DB doesn't match the provided token
        if (user.otp !== token) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check if OTP has expired
        if (new Date() > new Date(user.otp_expiry)) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Update user as verified and clear OTP
        await pool.query(
            'UPDATE register_users SET is_verified = true, otp = NULL, otp_expiry = NULL WHERE email = $1',
            [email]
        );

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (err) {
        // Log the full error message for debugging
        console.error('OTP verify error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


DbConnection();

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
