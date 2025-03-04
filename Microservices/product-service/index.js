const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 8002;

app.use(cors());

// MongoDB connection URI
const uri = 'mongodb://admin:pass123@mongodb-service:27017/ecommerce?authSource=admin';
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

// Endpoint to get all products
app.get('/products', async (req, res) => {
    try {
        const products = await db.collection('products').find().toArray();
        res.json(products);
    } catch (err) {
        res.status(500).send('Error fetching products');
    }
});

app.listen(PORT, () => {
    console.log(`Product Service running on http://localhost:${PORT}`);
});
