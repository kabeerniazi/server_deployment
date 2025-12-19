require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); 

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

const testimonialSchema = new mongoose.Schema({
  name: String,
  designation: String,
  message: String,
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

app.get("/", (req, res) => {
  res.send("Testimonials API is running...");
});

app.get("/testimonials", async (req, res) => {
  try {
    const allTestimonials = await Testimonial.find();
    res.json(allTestimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/testimonial", async (req, res) => {
  try {
    const newTestimonial = await Testimonial.create({
      name: req.body.name,
      designation: req.body.designation,
      message: req.body.message
    });
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;