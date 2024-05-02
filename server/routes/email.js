const router = require('express').Router()
const EmailController = require('../controllers/EmailController')
const controller = new EmailController

router.post('/', controller.sendEmail)

router.post('/test', controller.sendEmailForTest)

module.exports = router