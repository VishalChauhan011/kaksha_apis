const router = require('express').Router()

const { createStudent } = require('../controllers/authController')

const {isLoggedIn, customRole} = require('../middleware/user')



router.route('/createstudent').post(createStudent)

module.exports = router;