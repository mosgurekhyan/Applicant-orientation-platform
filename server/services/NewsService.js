class NewsService {
  constructor (models) {
    this.models = models
  }

  async getAll () {
    const news = await this.models.news.find()
    return news
  }

  async getLastFor () {
    const news = await this.models.news.find().sort({ createdAt: -1 }).limit(4)
    return news
  }

  async addNews (body) {
    const news = new this.models.news({ ...body })
    await news.save()
    return news
  }

  async getUniqueNews (_id) {
    const news = await this.models.news.findById(_id)
    return news
  }

  async editNews (_id, body) {
    const editedNews = await this.models.news.updateOne({ _id }, { ...body })
    return editedNews
  }

  async deleteNews (_id) {
    const deletedNews = await this.models.news.deleteOne({ _id })
    return deletedNews
  }
}

module.exports = NewsService