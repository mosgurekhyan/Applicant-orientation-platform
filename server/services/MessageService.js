const nodemailer = require('nodemailer')
const chatModel = require("../models/chat.model")
const messageModel = require("../models/message.model")

const sendEmail = async chatId => {
  try {
    const chat = await chatModel.findById(chatId)
    const lastMessageId = chat.messages[chat.messages.length - 2]
    const lastMessage = await messageModel.findById(lastMessageId)
    const lastMessageContent = lastMessage.content
    const theLastButOneId = chat.messages[chat.messages.length - 4]
    const theLastButOneMessage = await messageModel.findById(theLastButOneId)
    const theLastButOneContent = theLastButOneMessage.content
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWORD
      }
    })
  
    const info = {
      to: 'platformorientationgmail.com',
      subject: 'Հարց դիմորդների կողմնորոշման հարթակից',
      html: `
        <p>${lastMessageContent}-ից։ ${theLastButOneContent}</p>
      `
    }

    await transporter.sendMail(info)
    return { message: 'Message successfully sent!' }
  } catch (error) {
    console.log('Error:',error)
  }
}

class MessageService {
  constructor (models) {
    this.models = models
  }

  async addMessage (body) {
    const { chatId, content } = body
    const newMessage = new this.models.messages({ ...body })
    await chatModel.findByIdAndUpdate(
      chatId,
      { $push: { messages: newMessage._id } }
    )
    if (content === 'Շնորհակալություն!') {
      sendEmail(chatId)
    }
    await newMessage.save()
    return newMessage
  }
}

module.exports = MessageService