const router = require('express').Router()
const MessageController = require('../controllers/MessageController')
const controller = new MessageController

router.post('/add', controller.addMessage)

module.exports = router