class StatisticDataController {
  async getAll (req, res) {
    try {
      const statisticsData = await req.app.services.statisticsData.getAll()
      res.json(statisticsData)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
    
  async addStatisticData (req, res) {
    try {
      const newStatisticData = await req.app.services.statisticsData.addStatisticData(req.body, req.file)
      res.json(newStatisticData)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
    
  async getUniqueStatisticData (req, res) {
    try {
      const { id } = req.query
      const uniqueStatisticData = await req.app.services.statisticsData.getUniqueStatisticData(id)
      res.json(uniqueStatisticData)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
    
  async editStatisticData (req, res) {
    try {
      const { id } = req.params
      const editedStatisticData = await req.app.services.statisticsData.editStatisticData(id, req.body, req.file)
      res.json(editedStatisticData)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }  

  async deleteStatisticData (req, res) {
    try {
      const { id } = req.params
      await req.app.services.statisticsData.deleteStatisticData(id)
      res.json('StatisticData successfully deleted!')
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = StatisticDataController