const express = require("express")
const { listProduct, getproducts, deleteProduct, getProductById, updateProduct } = require("../controllers/product.controller")
const { verifyUser } = require("../controllers/user.controller")

const router = express.Router()

router.post("/addProduct",verifyUser, listProduct)
router.get("/products",verifyUser, getproducts)
router.delete("/products/:id", verifyUser, deleteProduct)
router.get("/products/:id", verifyUser, getProductById)
router.put("/products/:id", verifyUser, updateProduct)


module.exports = router
