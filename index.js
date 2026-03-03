const express = require('express')
const app = express()
const ejs = require('ejs')
const mongoose = require("mongoose")
const cors = require("cors")
const methodOverride = require('method-override')
app.set('view engine', 'ejs')
const dotenv = require('dotenv')
dotenv.config()
app.use(cors()) // Enable CORS before routes
app.use(express.urlencoded({extended:true}))
app.use(express.json({limit: '50mb'})) // Increase the limit for JSON payloads
app.use(methodOverride('_method'))
const UserRouter = require ('./routers/userRoutes')  
const ProductRouter = require('./routers/product.routes')

app.use('/api/v1', ProductRouter)
app.use('/api/v1', UserRouter)


mongoose.connect(process.env.DATABASE_URI)
  .then(()=>{
    console.log('database connected successfully')
  })
  .catch((error)=>{  
    console.log('failed to connect to db', error)
  })


const products = [
  {
    prodName: "laptop",
    prodPrice: 20,
    prodQuantity: 10,
    prodDescription: "Laptop product"
  },
  {
    prodName: "smartphone",
    prodPrice: 15,
    prodQuantity: 25,
    prodDescription: "Smartphone product"
  },
  {
    prodName: "tablet",
    prodPrice: 18,
    prodQuantity: 12,
    prodDescription: "Tablet product"
  },
  {
    prodName: "headphones",
    prodPrice: 5,
    prodQuantity: 40,
    prodDescription: "Headphones product"
  },
  {
    prodName: "keyboard",
    prodPrice: 7,
    prodQuantity: 30,
    prodDescription: "Keyboard product"
  },
  {
    prodName: "mouse",
    prodPrice: 4,
    prodQuantity: 50,
    prodDescription: "Mouse product"
  },
  {
    prodName: "monitor",
    prodPrice: 22,
    prodQuantity: 8,
    prodDescription: "Monitor product"
  },
  {
    prodName: "printer",
    prodPrice: 25,
    prodQuantity: 6,
    prodDescription: "Printer product"
  },
  {
    prodName: "webcam",
    prodPrice: 6,
    prodQuantity: 20,
    prodDescription: "Webcam product"
  },
  {
    prodName: "speaker",
    prodPrice: 9,
    prodQuantity: 18,
    prodDescription: "Speaker product"
  }
];


app.get('/', (req, res)=>{
   console.log(__dirname);
   res.sendFile(__dirname +"/index.html")
});


const ProductModel = require("./models/product.model")

app.get('/index', async (req, res)=>{
  try {
    const products = await ProductModel.find().populate("createdBy","firstName lastName email")
    res.render('index', { products })
  } catch (error) {
    console.log('Error fetching products:', error)
    res.render('index', { products: [] })
  }
})

app.get('/addproduct', (req, res)=>{
  res.render("addProduct")
})


app.post('/addproduct', (req, res) => {
  const { prodName, prodPrice, prodQuantity, prodDescription } = req.body;
  if (prodName && prodPrice && prodQuantity && prodDescription) {
    products.push({
      prodName,
      prodPrice: Number(prodPrice),
      prodQuantity: Number(prodQuantity),
      prodDescription
    });
    res.redirect('/index');
  } else {
    res.status(400).send('All fields are required');
  }
});

app.post("/deleteprod/:id", (req, res) => {
  const {id} = req.params;
  products.splice(id, 1);
  res.redirect('/index');
});


app.get('/editprod/:id', (req, res) => {
  const { id } = req.params;
  const product = products[id];
  res.render('editProduct', { product, id });
});

app.post('/updateprod/:id', (req, res) => {
  const { id } = req.params;
  const { prodName, prodPrice, prodQuantity, prodDescription } = req.body;
  
  if (prodName && prodPrice && prodQuantity && prodDescription) {
    products[id] = {
      prodName,
      prodPrice: Number(prodPrice),
      prodQuantity: Number(prodQuantity),
      prodDescription
    };
    res.redirect('/index');
  } else {
    res.status(400).send('All fields are required');
  }
});

// Start server
const PORT = process.env.PORT || 5008;
app.listen(PORT, (err) => {  
  if (err) {
    console.log('Error starting server:', err);  
  } else {
    console.log(`Server is running on port ${PORT}`);  
  }
})
