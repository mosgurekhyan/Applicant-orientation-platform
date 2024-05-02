const fs = require('fs')
const path = require('path')

class ProcedureService {
  constructor (models) {
    this.models = models
  }

  async getAll () {
    const procedures = await this.models.procedures.find()
    return procedures
  }

  async addProcedure (files) {
    const { img, file } = files
    const newProcedure = new this.models.procedures({
      img: path.join('uploads', img[0].filename),
      file: path.join('uploads', file[0].filename)
    })

    await newProcedure.save()
    return newProcedure
  }

  async getUniqueProcedure (_id) {
    const procedure = await this.models.procedures.findById(_id)
    return procedure
  }

  async editProcedure (_id, files) {
    const procedureToEdit = await this.models.procedures.findById(_id)
    const updatedProcedure = await this.models.procedures.findByIdAndUpdate(
      _id,
      {
        img: files?.img ? path.join('uploads', files?.img[0].filename) : procedureToEdit.img,
        file: files?.file ? path.join('uploads', files?.file[0].filename) : procedureToEdit.file
      },
      { new: true } 
    )

    return updatedProcedure
  }

  async deleteProcedure (_id) {
    const procedureToDelete = await this.models.procedures.findById(_id)

    fs.unlinkSync(path.join(__dirname, `../${procedureToDelete.img}`))
    fs.unlinkSync(path.join(__dirname, `../${procedureToDelete.file}`))

    await this.models.procedures.deleteOne({ _id })
    return { message: 'Procedure deleted successfully' }
  }
}

module.exports = ProcedureService