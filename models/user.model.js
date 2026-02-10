

const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    firstName: {type: String, required: true},  // Fixed: was "firstnam"
    lastName: {type: String, required: true},   // Fixed: was "lastname"
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    roles: {type: String, enum: ['user', 'admin'], default: "user"},
}, {timestamps: true, strict: "throw"})

const userModel = mongoose.model("user", userschema)

module.exports = userModel








