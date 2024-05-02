const router = require('express').Router()
const ChatController = require('../controllers/ChatController')
const controller = new ChatController

router.get('/', controller.getChat)

router.post('/add', controller.addChat)

router.delete('/:id', controller.deleteChat)

module.exports = router