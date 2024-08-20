


const port = process.env.PORT ||4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const url = 'https://mern-ec-deploy-backend.onrender.com';

app.use(express.json());
app.use(cors());

// Image storage engine
const storage = multer.diskStorage({
  destination: './upload/images', // Save images in this directory
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });
app.use('/images', express.static('upload/images')); // Serve static files from the images directory

// Upload Endpoint
app.post("/upload", upload.single('product'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: 'No file uploaded' });
  }

  // Construct the image URL path
  const imageUrl = `/images/${req.file.filename}`;

  res.json({
    success: 1,
    image_url: imageUrl  // This is the path stored in the database
  });
});

// Example of storing the image in the Product schema
const Product = mongoose.model("Product", {
  id: Number,
  name: String,
  image: String, // This will store the relative path like "/images/product_12345.jpg"
  category: String,
  new_price: Number,
  old_price: Number,
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

app.post('/addproduct', async (req, res) => {
  const newProduct = new Product({
    id: req.body.id,
    name: req.body.name,
    image: req.body.image,  // This should be the relative URL returned by the upload endpoint
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  try {
    await newProduct.save();
    res.json({ success: true, name: req.body.name });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving product" });
  }
});

// Server setup
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
