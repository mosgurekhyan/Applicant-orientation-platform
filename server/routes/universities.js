const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const UniversityController = require('../controllers/UniversityController')
const controller = new UniversityController

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

router.get('/unique', controller.getUniqueUniversity)

router.get('/unique-professions', controller.getUniqueUniversityProfessions)

router.post('/add', [ upload.single('img') ], controller.addUniversity)

router.patch('/:id', [ upload.single('img') ], controller.editUniversity)

router.delete('/:id', controller.deleteUniversity)

module.exports = router