const router = require('express').Router()
const NewsController = require('../controllers/NewsController')
const controller = new NewsController

router.get('/', controller.getAll)

router.get('/lastfour', controller.getLastFor)

router.get('/unique', controller.getUniqueNews)

router.post('/add', controller.addNews)

router.patch('/:id', controller.editNews)

router.delete('/:id', controller.deleteNews)

module.exports = router