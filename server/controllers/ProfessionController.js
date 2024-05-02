class ProfessionController {
  async getAll (req, res) {
    try {
      const professions = await req.app.services.professions.getAll()
      res.json(professions)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async addProfession (req, res) {
    try {
      const newProfession = await req.app.services.professions.addProfession(req.body, req.file)
      res.json(newProfession)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async getUniqueProfession (req, res) {
    try {
      const { id } = req.query
      const uniqueProfession = await req.app.services.professions.getUniqueProfession(id)
      res.json(uniqueProfession)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async editProfession (req, res) {
    try {
      const { id } = req.params
      const editedProfession = await req.app.services.professions.editProfession(id, req.body, req.file)
      res.json(editedProfession)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async deleteProfession (req, res) {
    try {
      const { id } = req.params
      await req.app.services.professions.deleteProfession(id)
      res.json('Profession successfully deleted!')
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = ProfessionController