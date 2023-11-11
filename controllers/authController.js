const Student = require('../models/student')
const User = require('../models/user')
const BigPromise = require('../middleware/bigPromise')
const CustomError = require('../utils/customError')
const cookieToken = require('../utils/cookieToken')

exports.createStudent = BigPromise(async (req, res, next) => {
    const {
        name,
        email,
        userId,
        password,
        admissionNo,
        address,
        gender,
        fathersName,
        mothersName,
        parentsContactNo,
        admissionYear,
        dateOfBirth, } = req.body;

    

    if (!name || !email || !userId || !password || !admissionNo || !address || !gender || !fathersName || !mothersName || !parentsContactNo || !admissionYear || !dateOfBirth) {
        return next(new CustomError("Please fill all the fields", 400))
    }

    const user = await User.create({
        name,
        email,
        userId,
        password,
    })

    //create student by populating it by user _id
    const student = await Student.create({
        user: user._id,
        admissionNo,
        address,
        gender,
        fathersName,
        mothersName,
        parentsContactNo,
        admissionYear,
        dateOfBirth
    })

    await student.populate('user');

    cookieToken(student, res)
})

exports.loginStudent = BigPromise(async (req, res, next) => {
    const {
        userId,
        password
    } = req.body;

    if (!userId || !password) {
        return next(new CustomError("Please provide userId and password", 400))
    }

    let student = await User.findOne({
        userId
    }).select("+password");

    if (!student) {
        return next(new CustomError("Student doesn't exist", 401))
    }

    const isMatch = await student.validatePassword(password);

    if (!isMatch) {
        return next(new CustomError("Invalid credentials", 401))
    }

    student = await Student.findOne({
        user: student._id
    }).populate('user');

    cookieToken(student, res)
})
