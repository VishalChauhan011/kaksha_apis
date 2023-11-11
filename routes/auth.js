const router = require('express').Router()

const { createStudent, getAllStudents, loginStudent } = require('../controllers/authController')

const {isLoggedIn, customRole} = require('../middleware/user')



router.route('/createstudent').post(createStudent)
router.route('/loginstudent').post(loginStudent)

module.exports = router;