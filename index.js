const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// 1. Middleware to parse JSON and serve HTML
app.use(express.json());
app.use(express.static('public'));

// 2. Connect to MongoDB Atlas
// (We use a cached connection for Vercel performance)
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

// 3. Define the Schema
const testimonialSchema = new mongoose.Schema({
    name: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);

// 4. Routes

// Serve the HTML file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route to upload data
app.post('/api/upload', async (req, res) => {
    await connectDB(); // Ensure DB is connected
    
    try {
        const newTestimonial = new Testimonial({
            name: req.body.name,
            message: req.body.message
        });
        
        await newTestimonial.save();
        res.status(200).json({ message: 'Saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}`));

module.exports = app;