//uncomment it to use it in local server
//require('dotenv').config();
const port = process.env.PORT;
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
// Removed the deprecated options
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// API CREATION
app.get("/", (req, res) => {
  res.send("Express App is running");
});

// Image storage engine
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });
app.use('/images', express.static('upload/images'));

// Creating Upload Endpoint for images
app.post("/upload", upload.single('product'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: 'No file uploaded' });
  }
  res.json({
    success: 1,
    image_url: `/images/${req.file.filename}`
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

app.post('/addproduct', async (req, res) => {
  // Rename the instance variable to avoid conflict with the model name
    let products= await Product.find({});
    let id ;
    if(products.length>0){
        let last_product_array= products.slice(-1);
        let last_product= last_product_array[0];
        id=last_product.id+1;
    }
    else{
        id=1;
    }
  const newProduct = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  console.log('Product Data:', newProduct); // Log product data

  try {
    await newProduct.save();
    console.log("Product saved");
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ success: false, message: "Error saving product" });
  }
});

//Creating API for deleting Products
app.post('/removeproduct',async (req,res)=>{
  await Product.findOneAndDelete({id:req.body.id});
  console.log("Removed");
  res.json({
    success:true,
    name:req.body.name
  })

})
//Creating API for getting all products
app.get('/allproducts',async (req,res)=>{
  let products = await Product.find({});
  console.log("All products fetched");
  res.send(products);
})
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

//Schema creating for user model
const Users = mongoose.model('Users', {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

// Creating Endpoint for registering the user
app.post('/signup', async (req, res) => {
  try {
    console.log('Request body:', req.body);

    // Check if the email already exists
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ success: false, error: "User already exists with the same email" });
    }

    // Create a cart object
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    // Create a new user
    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,  // Ensure this is being set
      cartData: cart
    });

    console.log('User data before save:', user);

    // Save the user to the database
    await user.save();
    console.log('User saved:', user);

    const data = {
      user: {
        id: user.id
      }
    };
    const jwtSecret = process.env.JWT_SECRET;

    const token = jwt.sign(data,jwtSecret);
    res.json({ success: true, token });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ success: false, error: "Error registering user" });
  }
});



//creating endpoint for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Special admin credentials check
  if (email === 'admin@gmail.com' && password === 'admin@123') {
    const token = jwt.sign({ email }, 'secret_ecom', { expiresIn: '1h' });
    return res.json({ success: true, token, isAdmin: true });
  }

  // Normal user login
  let user = await Users.findOne({ email });
  if (user) {
    const passCompare = password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, 'secret_ecom', { expiresIn: '1h' });
      return res.json({ success: true, token, isAdmin: false });
    } else {
      return res.json({ success: false, errors: 'Wrong Password' });
    }
  } else {
    return res.json({ success: false, errors: 'Wrong email' });
  }
});



//creating endpoint for new collection data
app.get('/newcollections',async (req,res)=>{
      let products = await Product.find({})
      let newcollection = products.slice(1).slice(-8);
      console.log("new collection fetched");
      res.send(newcollection)
})

//creating endpoint for popular in women
app.get('/popularinwomen',async (req,res)=>{
  let products = await Product.find({category:"women"})
  let popular_in_women = products.slice(0,4);
  console.log("Popular in Women fetched");
  res.send(popular_in_women);
})

//Creating middelware to fetch user

const fetchUser = async (req,res,next)=>{
  const token = req.header('auth-token');
  if (!token) {
    res.status(401).send({errors:"Plese authenticate using your registed ID"})
  }
  else{
    try{
      const data = jwt.verify(token,'secret_ecom');
      req.user =data.user;
      next();
    }catch(error){
res.status(401).send({eorros:"Please authanticate with valid ID"})
    }
  }
}

//creating endpoint for adding products in cartdata

app.post('/addtocart',fetchUser, async (req,res)=>{
  console.log(req.body,req.user);
let userData = await Users.findOne({_id:req.user.id});
userData.cartData[req.body.itemId]+=1;
await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
res.send("Added");
})


//Endpoint for removing cartdata

app.post('/removefromcart',fetchUser,async (req,res)=>{
  console.log("removed",req.body.itemId);
  let userData = await Users.findOne({_id:req.user.id});
  if (userData.cartData[req.body.itemId]>0) 
  userData.cartData[req.body.itemId]-=1;
  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
  res.send("Removed")
})
//Endpoint to get cart data
app.post('/getcart',fetchUser,async(req,res)=>{
  console.log("GetCart");
  let userData = await Users.findOne({_id:req.user.id})
  res.json(userData.cartData);


})
app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on port " + port);
  } else {
    console.log("Error: " + error);
  }
});
