

const express = require('express');
const {createUser, editUser, deleteUser, getUser, login, getAllUsers, verifyUser, getMe } = require('../controllers/user.controller');
const router = express.Router();


router.post("/register", createUser);

router.patch('/edituser/:id', editUser)

router.delete("/deleteuser/:id", deleteUser)

router.post("/login", login)
router.get("/me", verifyUser, getMe)




 router.get("/getuser/:id", getUser)
router.get("/getallusers", verifyUser, getAllUsers)

module.exports=router