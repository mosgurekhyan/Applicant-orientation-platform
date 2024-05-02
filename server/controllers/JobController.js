class JobController {
  async getAll (req, res) {
    try {
      const jobs = await req.app.services.jobs.getAll()
      res.json(jobs)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
        
  async addJob (req, res) {
    try {
      const newJob = await req.app.services.jobs.addJob(req.body, req.file)
      res.json(newJob)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
        
  async getUniqueJob (req, res) {
    try {
      const { id } = req.query
      const uniqueJob = await req.app.services.jobs.getUniqueJob(id)
      res.json(uniqueJob)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
        
  async editJob (req, res) {
    try {
      const { id } = req.params
      const editedJob = await req.app.services.jobs.editJob(id, req.body, req.file)
      res.json(editedJob)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }  
    
  async deleteJob (req, res) {
    try {
      const { id } = req.params
      await req.app.services.jobs.deleteJob(id)
      res.json('Job successfully deleted!')
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = JobController