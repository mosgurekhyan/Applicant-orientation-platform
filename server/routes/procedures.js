const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const ProcedureController = require('../controllers/ProcedureController')
const controller = new ProcedureController

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

router.get('/unique', controller.getUniqueProcedure)

router.post('/add', upload.fields([ { name: 'img' }, { name: 'file' } ]), controller.addProcedure)

router.patch('/:id', upload.fields([ { name: 'img' }, { name: 'file' } ]), controller.editProcedure)

router.delete('/:id', controller.deleteProcedure)

module.exports = router