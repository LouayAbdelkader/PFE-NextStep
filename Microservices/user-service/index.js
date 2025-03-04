const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 8001;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URI

const uri = 'mongodb://mongo-serviceadmin:pass123@mongodb-service:27017/ecommerce';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        db = client.db('ecommerce');
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err);
    }
}

connectDB();

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password: hashedPassword };

    try {
        const result = await db.collection('users').insertOne(user);
        res.status(201).send('User registered');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.collection('users').findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid credentials');
        }
        const token = jwt.sign({ email }, 'secret_key', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).send('Error during login');
    }
});

// Logout endpoint (client-side token deletion)
app.post('/logout', (req, res) => {
    res.send('Logged out');
});

app.listen(PORT, () => {
    console.log(`User Service running on http://localhost:${PORT}`);
});
