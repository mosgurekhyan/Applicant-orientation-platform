const fs = require('fs')
const path = require('path')

class ProfessionService {
  constructor (models) {
    this.models = models
  }

  async findUniversityByProfessionId(professionId) {
    try {
      const university = await this.models.universities.findOne({ professions: professionId })
      return university
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async getAll() {
    const professions = await this.models.professions.find().populate('jobs')
    const populatedProfessions = await Promise.all(professions.map(async (profession) => {
      const university = await this.findUniversityByProfessionId(profession._id)
      const professionWithUniversity = { ...profession.toObject(), university: university ? university.name : null }
      return professionWithUniversity
    }))
    return populatedProfessions
  }

  async addProfession (body, file) {
    const newProfession = new this.models.professions({ ...body, img: path.join('uploads', file.filename) })
    await newProfession.save()
    return newProfession
  }

  async getUniqueProfession (_id) {
    const uniqueProfession = await this.models.professions.findById(_id).populate('jobs')
    return uniqueProfession
  }

  async editProfession (_id, body, file) {
    const profession = await this.models.professions.findById(_id)
    if (file) {
      fs.unlinkSync(path.join(__dirname, `../${profession.img}`))
      const editedProfession = await this.models.professions.updateOne({ _id }, { ...body, img: path.join('uploads', file.filename) })
      return editedProfession
    } else {
      const editedProfession = await this.models.professions.updateOne({ _id }, { ...body, img: profession.img })
      return editedProfession
    }
  }

  async deleteProfession (_id) {
    const profession = await this.models.professions.findById(_id)

    fs.unlinkSync(path.join(__dirname, `../${profession.img}`))

    await this.models.universities.updateMany(
      { professions: _id }, { $pull: { professions: _id } }
    )
    const deletedProfession = await this.models.professions.deleteOne({ _id })
    return deletedProfession
  }
}

module.exports = ProfessionService