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
        const { email, password } = req.body;

        console.log(email);
        console.log(password);


        if (!email || !password) {
            return res.status(400).send('Email and password are required');
        }

        // Find the user in the database
        const userResult = await pool.query('SELECT * FROM login WHERE email = $1', [email]);
        // if (userResult.rows.length === 0) {
        //     return res.status(404).send('Account not found. Please create an account first.');
        // }

        console.log(email,  'database');
        console.log(password,'database');
        const user = userResult.rows[0];

        // Check password
        if (password !== user.password) {
            return res.status(401).send('Invalid credentials');
        }

        // Generate Access Token (Short-lived)
        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Short lifespan for security
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.REFRESH_SECRET,
            { expiresIn: '7d' } // Valid for 7 days
        );

        // Save Refresh Token in the database (optional)
        await pool.query('UPDATE login SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

        // Set Refresh Token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'dev',
            sameSite: 'Strict',
            path: '/api/refresh-token',
        });

        // Send back only the access token
        res.status(200).json({ accessToken });
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
