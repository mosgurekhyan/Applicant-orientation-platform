const router = require('express').Router()
const UserController = require('../controllers/UserController')
const controller = new UserController

router.get('/', controller.findWithGoogleId)

router.get('/unique', controller.getUniqueUser)

router.post('/save-profession', controller.saveProfession)

module.exports = router