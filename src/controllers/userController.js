const pool = require('../config/db'); // Ensure this is set up correctly
const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating tokens

// Function to register a user
const registerUser = async (req, res) => {
    const { name, email, mobile_number, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const result = await pool.query(
            'INSERT INTO users (name, email, mobile_number, password) VALUES ($1, $2, $3, $4) RETURNING id',
            [name, email, mobile_number, hashedPassword]
        );

        res.status(201).send({ message: 'User registered successfully', userId: result.rows[0].id });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ message: 'Error registering user' });
    }
};

// Function to log in a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
        return res.status(400).send({ message: 'Email and password are required.' });
    }

    try {
        // Retrieve user from the database
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        // Check if user exists and password matches
        if (user && (await bcrypt.compare(password, user.password))) {
            // No JWT token is generated here
            return res.status(200).send({ message: 'User logged in successfully', userId: user.id });
        } else {
            return res.status(401).send({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).send({ message: 'Error logging in user' });
    }
};


module.exports = { registerUser, loginUser };
