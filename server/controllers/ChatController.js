class ChatController {
  async addChat (req, res) {
    try {
      const newChat = await req.app.services.chats.addChat()
      res.json(newChat)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  
  async getChat (req, res) {
    try {
      const { chatId } = req.query
      const chat = await req.app.services.chats.getChat(chatId)
      res.json(chat)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  
  async deleteChat (req, res) {
    try {
      const { id } = req.params
      await req.app.services.chats.deleteChat(id)
      res.send('Chat successfully deleted!')
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}
  
module.exports = ChatController