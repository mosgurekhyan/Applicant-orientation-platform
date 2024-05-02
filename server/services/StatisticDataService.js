const fs = require('fs')
const path = require('path')

class StatisticDataService {
  constructor (models) {
    this.models = models
  }

  async getAll () {
    const statisticsData = await this.models.statisticsData.find()
    return statisticsData
  }

  async addStatisticData (body, file) {
    const statisticData = new this.models.statisticsData({ ...body, img: path.join('uploads', file.filename) })
    await statisticData.save()
    return statisticData
  }

  async getUniqueStatisticData (_id) {
    const statisticData = await this.models.statisticsData.findById(_id)
    return statisticData
  }

  async editStatisticData (_id, body, file) {
    const statisticData = await this.models.statisticsData.findById(_id)
    if (file) {
      fs.unlinkSync(path.join(__dirname, `../${statisticData.img}`))
      const editedstatisticData = await this.models.statisticsData.updateOne({ _id }, { ...body, img: path.join('uploads', file.filename) })
      return editedstatisticData
    } else {
      const editedStatisticData = await this.models.statisticsData.updateOne({ _id }, { ...body, img: statisticData.img })
      return editedStatisticData
    }
  }

  async deleteStatisticData (_id) {
    const statisticData = await this.models.statisticsData.findById(_id)
    fs.unlinkSync(path.join(__dirname, `../${statisticData.img}`))
    const deletedStatisticData = await this.models.statisticsData.deleteOne({ _id })
    return deletedStatisticData
  }
}

module.exports = StatisticDataService