const router = require('express').Router()
const LoginController = require('../controllers/LoginController')
const controller = new LoginController

router.post('/', controller.userLogin)

router.post('/refresh', controller.refreshToken)

router.patch('/changepassword', controller.changePassword)

module.exports = router