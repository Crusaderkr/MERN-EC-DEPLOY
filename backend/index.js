// Uncomment it to use it in local server
// require('dotenv').config();
const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// API CREATION
app.get("/", (req, res) => {
  res.send("Express App is running");
});

// Image storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload/images'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, `${file.fieldname}_${uniqueSuffix}`);
  }
});

const upload = multer({ storage: storage });
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// Creating Upload Endpoint for images
app.post("/upload", upload.single('product'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: 'No file uploaded' });
  }
  
  const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  
  res.json({
    success: 1,
    image_url: imageUrl
  });
});

// Schema for creating products
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

// Other endpoints as per your code

app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on port " + port);
  } else {
    console.log("Error: " + error);
  }
});
