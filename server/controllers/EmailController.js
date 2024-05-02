class EmailController {
  async sendEmail (req, res) {
    try {
      const message = await req.app.services.email.sendEmail(req.body)
      res.json(message)
    } catch (error) {
      res.status(500).json({ message: error.message }) 
    }
  }

  async sendEmailForTest (req, res) {
    try {
      const message = await req.app.services.email.sendEmailForTest(req.body)
      res.json(message)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = EmailController