const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const ProfessionController = require('../controllers/ProfessionController')
const controller = new ProfessionController

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

router.get('/unique', controller.getUniqueProfession)

router.post('/add', [ upload.single('img') ], controller.addProfession)

router.patch('/:id', [ upload.single('img') ], controller.editProfession)

router.delete('/:id', controller.deleteProfession)

module.exports = router