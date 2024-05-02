const fs = require('fs')
const path = require('path')

class UniversityService {
  constructor (models) {
    this.models = models
  }

  async getAll () {
    const universities = await this.models.universities.find()
    return universities
  }

  async addUniversity (body, file) {
    const newUniversity = new this.models.universities({ ...body, img: path.join('uploads', file.filename) })
    await newUniversity.save()
    return newUniversity
  }

  async getUniqueUniversity (_id) {
    const uniqueUniversity = await this.models.universities.findById(_id)
    return uniqueUniversity
  }

  async getUniqueUniversityProfessions (_id) {
    const uniqueUniversity = await this.models.universities.findById(_id).populate('professions', '-__v', ).select('-img')
    return uniqueUniversity
  }

  async editUniversity (_id, body, file) {
    const university = await this.models.universities.findById(_id)

    if (file) {
      fs.unlinkSync(path.join(__dirname, `../${university.img}`))
      const editedUniversity = await this.models.universities.updateOne({ _id }, { ...body, img: path.join('uploads', file.filename) })
      return editedUniversity
    } else {
      const editedUniversity = await this.models.universities.updateOne({ _id }, { ...body, img: university.img })
      return editedUniversity
    }
  }

  async deleteUniversity (_id) {
    const university = await this.models.universities.findById(_id)
    fs.unlinkSync(path.join(__dirname, `../${university.img}`))
    const deletedUniversity = await this.models.universities.deleteOne({ _id })
    return deletedUniversity
  }
}

module.exports = UniversityService