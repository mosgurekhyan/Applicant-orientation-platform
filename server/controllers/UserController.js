class UserController {
  async findWithGoogleId (req, res) {
    try {
      const { id } = req.query
      const existingUser = await req.app.services.users.findWithGoogleId(id)
      res.json(existingUser)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async saveProfession (req, res) {
    try {
      const savedData = await req.app.services.users.saveProfession(req.body)
      res.json(savedData)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async getUniqueUser (req, res) {
    try {
      const { id } = req.query
      const user = await req.app.services.users.getUniqueUser(id)
      res.json(user)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = UserController