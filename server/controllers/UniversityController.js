class UniversityController {
  async getAll (req, res) {
    try {
      const universities = await req.app.services.universities.getAll()
      res.json(universities)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async addUniversity (req, res) {
    try {
      const newUniversity = await req.app.services.universities.addUniversity(req.body, req.file)
      res.json(newUniversity)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async getUniqueUniversity (req, res) {
    try {
      const { id } = req.query
      const uniqueUniversity = await req.app.services.universities.getUniqueUniversity(id)
      res.json(uniqueUniversity)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async getUniqueUniversityProfessions (req, res) {
    try {
      const { id } = req.query
      const uniqueUniversity = await req.app.services.universities.getUniqueUniversityProfessions(id)
      res.json(uniqueUniversity)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async editUniversity (req, res) {
    try {
      const { id } = req.params
      const editedUniversity = await req.app.services.universities.editUniversity(id, req.body, req.file)
      res.json(editedUniversity)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async deleteUniversity (req, res) {
    try {
      const { id } = req.params
      await req.app.services.universities.deleteUniversity(id)
      res.json('University successfully deleted!')
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = UniversityController