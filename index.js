const express = require('express')
const app = express()
const ejs = require('ejs')
const mongoose = require("mongoose")
const cors = require("cors")
app.set('view engine', 'ejs')
const dotenv = require('dotenv')
dotenv.config()
app.use(cors()) // Enable CORS before routes
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const UserRouter = require ('./routers/userRoutes')  
app.use('/api/v1', UserRouter)


mongoose.connect(process.env.DATABASE_URI)
  .then(()=>{
    console.log('database connected successfully')
  })
  .catch((error)=>{  // FIXED: Changed 'err' to 'error' to match the parameter
    console.log('failed to connect to db', error)
  })

// var x = 5
// let sum = x+10
// console.log(sum)

// let students ={
//     name: wG
//     course: "web dev"
//     age: 21
//     complexion: caramel
// }

// console.log(students)

// const path = require('path')
// require('dotenv').config({ path: path.resolve(__dirname, '.env') })



// console.log('DB URI →', process.env.DATABASE_URI)


// console.log(process.env.DATABASE_URI)



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

// const users = [
//   {
//     userName: "john_doe",
//     userEmail: "john@example.com",
//     userAge: 28,
//     userRole: "Admin"
//   },
//   {
//     userName: "jane_smith",
//     userEmail: "jane@example.com",
//     userAge: 25,
//     userRole: "Editor"
//   },
//   {
//     userName: "michael_brown",
//     userEmail: "michael@example.com",
//     userAge: 32,
//     userRole: "User"
//   },
//   {
//     userName: "emily_white",
//     userEmail: "emily@example.com",
//     userAge: 27,
//     userRole: "User"
//   },
//   {
//     userName: "david_johnson",
//     userEmail: "david@example.com",
//     userAge: 35,
//     userRole: "Manager"
//   },
//   {
//     userName: "sarah_wilson",
//     userEmail: "sarah@example.com",
//     userAge: 24,
//     userRole: "User"
//   },
//   {
//     userName: "daniel_martin",
//     userEmail: "daniel@example.com",
//     userAge: 30,
//     userRole: "Editor"
//   },
//   {
//     userName: "olivia_taylor",
//     userEmail: "olivia@example.com",
//     userAge: 26,
//     userRole: "User"
//   },
//   {
//     userName: "james_anderson",
//     userEmail: "james@example.com",
//     userAge: 40,
//     userRole: "Admin"
//   },
//   {
//     userName: "lucas_moore",
//     userEmail: "lucas@example.com",
//     userAge: 22,
//     userRole: "User"
//   }
// ];


app.get('/', (req, res)=>{
 //  res.send(users)
   console.log(__dirname);
   res.sendFile(__dirname +"/index.html")
});


app.get('/index', (req, res)=>{
  res.render('index', {products})
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
app.listen(PORT, (err) => {  // FIXED: Using PORT variable instead of process.env.PORT directly
  if (err) {
    console.log('Error starting server:', err);  // FIXED: Added err to see the actual error
  } else {
    console.log(`Server is running on port ${PORT}`);  // FIXED: More descriptive message
  }
})