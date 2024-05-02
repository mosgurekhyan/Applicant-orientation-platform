class StatisticService {
  constructor (models) {
    this.models = models
  }

  async getAll () {
    const statistics = await this.models.statistics.find()
    return statistics
  }

  async addStatistic (body) {
    const newStatistic = new this.models.statistics({ ...body })
    await newStatistic.save()
    return newStatistic
  }

  async getUniqueStatistic (_id) {
    const statistic = await this.models.statistics.findById(_id)
    return statistic
  }

  async editStatistic (_id, body) {
    const editedStatistic = await this.models.statistics.updateOne({ _id }, { ...body })
    return editedStatistic
  }

  async deleteStatistic (_id) {
    const deletedStatistic = await this.models.statistics.deleteOne({ _id })
    return deletedStatistic
  }
}

module.exports = StatisticService