const router = require('express').Router()
const StatisticController = require('../controllers/StatisticController')
const controller = new StatisticController

router.get('/', controller.getAll)

router.get('/unique', controller.getUniqueStatistic)

router.post('/add', controller.addStatistic)

router.patch('/:id', controller.editStatistic)

router.delete('/:id', controller.deleteStatistic)

module.exports = router