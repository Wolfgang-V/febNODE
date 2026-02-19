const UserModel = require("../models/user.model")
const bcrypt= require("bcrypt")
const jwt = require("jsonwebtoken")

const createUser = async (req, res)=>{
    const {lastName, email, password, firstName} = req.body;

try {
const saltround = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password, saltround)

    const user = await UserModel.create({firstName, lastName,email, password:hashedPassword,});

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:"5h"})
res.status(201).send({
    message:"user created successfully",
    data:{
           lastName,
           email,
          firstName,
          roles:user.roles
},
token
}
);
    
} 
catch (error) {
    console.log(error);
    if(error.code === 11000){
         res.status(400).send({
            message:"email already exists"
         })
    } else {
    res.status(400).send({
    
        message:"user creation failed",
        error:error.message
    })
    }
}
}


const login = async (req, res)=>{
    const {email, password} = req.body;
    try{
        const isUser = await UserModel.findOne({ email });
        if(!isUser){
             res.status(400).send({
                message:"invalid credentials"
            });
            return;
        }
const isMatch = await bcrypt.compare(password, isUser.password)
if(!isMatch){
     res.status(400).send({
        message:"invalid credentials"
    });
    return;
}
const token = jwt.sign({id:isUser._id, roles:isUser.roles}, process.env.JWT_SECRET,{expiresIn:"5h"})
res.status(200).send({
    message:"login successful",
    data:{
        email:isUser.email,
        firstName:isUser.firstName,
        lastName:isUser.lastName,
        roles:isUser.roles
    },
    token
})
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message:"login failed",
            error:error.message
        })
    }
}


const editUser=async (req, res)=>{
    const {firstName, lastName}=req.body
    const {id}= req.params;


    try {
        let allowedupdates = {
        ...(firstName&&{firstName}),
        ...(lastName&&{lastName})
        }
        const newUser= await UserModel.findByIdAndUpdate(id, allowedupdates)
        res.status(200).send({
            message:"user updated successfully",
            
        })
    } catch (error) {
        console.log(error);


        res.status(400).send({
            message:"user update failed",
            error:error.message
        })
    }
}

const deleteUser=async (req, res)=>{
    const { id } = req.params;
    try{
        const isDeleted = await UserModel.findByIdAndDelete(id)
        if (!isDeleted) {
            
        }
        res.status(204).send({
            message:"user deleted successfully",
    })


}catch(error){
    console.log(error);
    res.status(400).send({
        message:"user deletion failed",
        error:error.message
    })
}

}

const getUser=async (req, res)=>{
    const { id } = req.params;
  try {
    const getUser = await UserModel.findById(id)
    res.status(200).send({
        message:"user retrieved successfully",
        data:getUser
    })
  }
   catch (error) {
    console.log(error);
    res.status(400).send({
        message:"user retrieval failed",
        error:error.message
    })
  }

}

const getAllUsers=async (req, res)=>{
    const user=req.user.roles
    try {

if ( user !== "admin"){
    return res.status(403).send({
        message:"forbidden"
    })
}



        const getFullUsers= await UserModel.find().select("-password")
        res.status(200).send({
            message:"users retrieved successfully",
            data: getFullUsers
        })


    }

     catch (error) {
        console.log(error);
        res.status(400).send({
            message:"users retrieval failed",
            error:error.message
        })
    }
};

const verifyUser = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
        return res.status(401).send({ message: 'authorization header missing' });
    }

    const parts = authHeader.split(' ').filter(Boolean);
    const token = parts.length === 2 ? parts[1] : parts[0];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'unauthorized' });
        }
        req.user = decoded;
        next();
    });
};


const getMe=async (req, res)=>{
    console.log(req.user.id);
// const {id}= req.user
// console.log(id);

    
    try{
        const user =await UserModel.findById(req.user.id).select("-password")
        res.status(200).send({
            message:"user retrieved successfully",
            data:user
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message:"user retrieval failed",
            error:error.message
        })
    }
}



module.exports= {
    createUser,
    login,
    editUser,
    deleteUser,
    getUser,
    getAllUsers,
    verifyUser,
    getMe
};