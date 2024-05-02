class MessageController {
  async addMessage (req, res) {
    try {
      const newMessage = await req.app.services.messages.addMessage(req.body)
      res.json(newMessage)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}
  
module.exports = MessageController
