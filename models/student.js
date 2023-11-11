require('dotenv').config();
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const {encryptPassword, validatePassword, getJwtToken} = require('../utils/authUtils')
const User = require('./user')

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    admissionNo: {
        type: Number,
        required: [true, 'Please enter your admission number'],
        unique: true
    },
    address: {
        type: String,
        required: [true, 'Please enter your address'],
    },
    gender: {
        type: String,
        required: [true, "Please select your gender"],
        trim: true,
        enum: ['male', 'female', 'other'],
    },
    fathersName: {
        type: String,
        required: [true, 'Please enter your father\'s name'],
    },
    mothersName: {
        type: String,
        required: [true, 'Please enter your mother\'s name'],
    },
    parentsContactNo: {
        type: Number,
        required: [true, 'Please enter your parents\' contact number'],
        maxLength: [10, 'Your contact number cannot exceed 10 characters']
    },
    admissionYear: {
        type: Number,
        required: [true, 'Please enter your admission year'],
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Please enter your date of birth'],
    },
})

studentSchema.pre('save', async function (next) {
    await encryptPassword(this);
    next();
});

studentSchema.methods.validatePassword = async function (password) {
    return await validatePassword(this, password);
};

studentSchema.methods.getJwtToken = function () {
    return getJwtToken(this);
  };

module.exports = mongoose.model('Student', studentSchema);