require('dotenv').config();
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    admissionNo: {
        type: Number,
        required: [true, 'Please enter your admission number'],
        unique: true,
        maxLength: [10, 'Your admission number cannot exceed 10 characters']
    },
    type: {
        type: String,
        required: [true, 'Please enter your type'],
        enum: {
            values: [
                'student',
                'teacher',
                'admin'
            ],
            message: 'Please select correct type'
        },
        default: 'student'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: {
        type: Date,
        default: Date.now()
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
})

// Encrypting password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

//validate the password with passed on user password
userSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

//create and return jwt token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
}


module.exports = mongoose.model('User', userSchema);