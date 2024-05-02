const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const StatisticDataController = require('../controllers/StatisticDataController')
const controller = new StatisticDataController

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
  }
})
  
const upload = multer({ storage })

router.get('/', controller.getAll)

router.get('/unique', controller.getUniqueStatisticData)

router.post('/add', [ upload.single('img') ], controller.addStatisticData)

router.patch('/:id', [ upload.single('img') ], controller.editStatisticData)

router.delete('/:id', controller.deleteStatisticData)

module.exports = router