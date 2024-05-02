const router = require('express').Router()
const AuthController = require('../controllers/AuthController')
const controller = new AuthController

router.get('/login/success', controller.loginSuccess)

router.get('/logout', controller.logOut)

router.get('/google', controller.googleAuth())

router.get('/google/callback', controller.googleCallback())

module.exports = router