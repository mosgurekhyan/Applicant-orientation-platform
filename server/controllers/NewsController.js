class NewsController {
  async getAll (req, res) {
    try {
      const news = await req.app.services.news.getAll()
      res.json(news)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async addNews (req, res) {
    try {
      const news = await req.app.services.news.addNews(req.body)
      res.json(news)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async getUniqueNews (req, res) {
    try {
      const { id } = req.query
      const news = await req.app.services.news.getUniqueNews(id)
      res.json(news)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async getLastFor (req, res) {
    try {
      const news = await req.app.services.news.getLastFor()
      res.json(news)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async editNews (req, res) {
    try {
      const { id } = req.params
      const editedNews = await req.app.services.news.editNews(id, req.body)
      res.json(editedNews)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async deleteNews (req, res) {
    try {
      const { id } = req.params
      const deletedNews = await req.app.services.news.deleteNews(id)
      res.json(deletedNews)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = NewsController