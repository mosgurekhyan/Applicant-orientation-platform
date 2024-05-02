const router = require('express').Router()
const RegisterController = require('../controllers/RegisterController')
const controller = new RegisterController

router.post('/', controller.userRegister)

router.post('/sendotp', controller.sendOtp)

router.patch('/verify', controller.verifyEmail)

module.exports = router