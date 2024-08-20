const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const url = 'https://mern-ec-deploy-backend.onrender.com';

// Middleware
app.use(express.json());
app.use(cors());  // To handle cross-origin requests

// Image storage engine
const storage = multer.diskStorage({
  destination: './upload/images', // Save images in this directory
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });
app.use('/images', express.static('upload/images')); // Serve static files from the images directory

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'your-mongodb-connection-string', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Schema for Product
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
    type: String, // This will store the relative path like "/images/product_12345.jpg"
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

// Add Product Endpoint
app.post('/addproduct', async (req, res) => {
  // Getting all existing products to determine the new product ID
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let lastProduct = products[products.length - 1];
    id = lastProduct.id + 1;
  } else {
    id = 1;
  }

  const newProduct = new Product({
    id: id,
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
    console.error("Error saving product:", error);
    res.status(500).json({ success: false, message: "Error saving product" });
  }
});

// Related Products Endpoint
app.get('/relatedproducts', async (req, res) => {
  try {
    // Fetch all products and randomly select 4
    const products = await Product.aggregate([{ $sample: { size: 4 } }]);
    res.json(products);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ success: false, message: "Error fetching related products" });
  }
});

// Server setup
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
