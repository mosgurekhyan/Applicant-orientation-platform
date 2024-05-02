const messageModel = require('../models/message.model')

class ChatService {
  constructor (models) {
    this.models = models
  }

  async addChat () {
    const newChat = new this.models.chats()
    await newChat.save()
    return newChat
  }

  async getChat (_id) {
    const messages = await this.models.chats.findOne({ _id }).populate('messages', '-__v')
    return messages
  }

  async deleteChat (_id) {
    const chat = await this.models.chats.findOne({ _id })

    await messageModel.deleteMany({ _id: { $in: chat.messages } })

    await this.models.chats.findOneAndDelete({ _id })

    return chat
  }
}

module.exports = ChatService