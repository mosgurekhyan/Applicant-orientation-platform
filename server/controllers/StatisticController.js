class StatisticController {
  async getAll (req, res) {
    try {
      const statistics = await req.app.services.statistics.getAll()
      res.json(statistics)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }  

  async addStatistic (req, res) {
    try {
      const newStatistic = await req.app.services.statistics.addStatistic(req.body)
      res.json(newStatistic)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }  

  async getUniqueStatistic (req, res) {
    try {
      const { id } = req.query
      const statistic = await req.app.services.statistics.getUniqueStatistic(id)
      res.json(statistic)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  } 

  async editStatistic (req, res) {
    try {
      const { id } = req.params
      const editedStatistic = await req.app.services.statistics.editStatistic(id, req.body)
      res.json(editedStatistic)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }  

  async deleteStatistic (req, res) {
    try {
      const { id } = req.params
      const deletedStatistic = await req.app.services.statistics.deleteStatistic(id)
      res.json(deletedStatistic)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = StatisticController