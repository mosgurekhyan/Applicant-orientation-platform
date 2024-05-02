const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const JobController = require('../controllers/JobController')
const controller = new JobController

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

router.get('/unique', controller.getUniqueJob)

router.post('/add', [ upload.single('img') ], controller.addJob)

router.patch('/:id', [ upload.single('img') ], controller.editJob)

router.delete('/:id', controller.deleteJob)

module.exports = router