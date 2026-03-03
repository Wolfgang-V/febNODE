const ProductModel = require("../models/product.model")
const cloudinary = require("cloudinary").v2


cloudinary.config({
    api_key:process.env.CLOUD_KEY,
    cloud_name:process.env.CLOUD_NAME,
    api_secret:process.env.CLOUD_SECRET
})


const listProduct=async(req, res)=>{
    const{productName, productPrice, productQuantity, productImage}= req.body

    
    
    try {
        // console.log(productImage);
       const result = await cloudinary.uploader.upload(productImage)

       let image = {
        public_id:result.public_id,
        secure_url: result.secure_url
       }

        const product = await ProductModel.create({
            productName,
            productPrice,
            productQuantity,
            productImage:image,
            createdBy:req.user.id
        })

        res.status(201).send({
            message:"Product added successfully",
            data:product
        })
    } catch (error) {
        console.log(error);

        res.status(400).send({
            message:"Error adding product"
        })
        
    }
}


const getproducts=async(req, res)=>{
    try {
        const products = await ProductModel.find().populate("createdBy","firstName lastName email")

        res.status(200).send(
            {
                message:"Products fetched successfully",
                data:products

            }
        )
    } catch (error) {
        console.log(error);
        
        res.status(404).send({
            message:"failed to fetch products"
        })
    }
}


const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await ProductModel.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        if (deletedProduct.productImage && deletedProduct.productImage.public_id) {
            await cloudinary.uploader.destroy(deletedProduct.productImage.public_id);
        }

        res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Error deleting product" });
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id).populate("createdBy", "firstName lastName email");
        
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send({ message: "Product fetched successfully", data: product });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Error fetching product" });
    }
}

const updateProduct = async (req, res) => {
    const { productName, productPrice, productQuantity, productImage } = req.body;
    
    try {
        const { id } = req.params;
        let updateData = { productName, productPrice, productQuantity };

        if (productImage && productImage.startsWith('data:')) {
            const result = await cloudinary.uploader.upload(productImage);
            updateData.productImage = {
                public_id: result.public_id,
                secure_url: result.secure_url
            };
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send({ message: "Product updated successfully", data: updatedProduct });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Error updating product" });
    }
}

module.exports= {
    listProduct,
    getproducts,
    deleteProduct,
    getProductById,
    updateProduct
}
