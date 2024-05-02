const fs = require('fs')
const path = require('path')

class JobService {
  constructor (models) {
    this.models = models
  }

  async getAll () {
    const jobs = await this.models.jobs.find()
    return jobs
  }

  async addJob (body, file) {
    const newJob = new this.models.jobs({ ...body, img: path.join('uploads', file.filename) })
    await newJob.save()
    await this.models.professions.updateMany(
      { _id: { $in: body.professions } },
      { $push: { jobs: newJob._id } } 
    )
    return newJob
  }

  async getUniqueJob (_id) {
    const uniqueJob = await this.models.jobs.findById(_id)
    return uniqueJob
  }

  async editJob (_id, body, file) {
    const job = await this.models.jobs.findById(_id)
    if (file) {
      fs.unlinkSync(path.join(__dirname, `../${job.img}`))
      const editedJob = await this.models.jobs.updateOne({ _id }, { ...body, img: path.join('uploads', file.filename) })
      return editedJob
    } else {
      const editedJob = await this.models.jobs.updateOne({ _id }, { ...body, img: job.img })
      return editedJob
    }
  }

  async deleteJob (_id) {
    const job = await this.models.jobs.findById(_id)
    fs.unlinkSync(path.join(__dirname, `../${job.img}`))

    await this.models.professions.updateMany(
      { jobs: _id }, { $pull: { jobs: _id } }
    )

    const deletedJob = await this.models.jobs.deleteOne({ _id })
    return deletedJob
  }
}

module.exports = JobService