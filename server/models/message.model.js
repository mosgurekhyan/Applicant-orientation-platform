const { Schema, model } = require('mongoose')

const messageSchema = Schema({
  sender: {
    type: String,
    required: true,
    enum: [ 'user', 'bot' ]
  },
  content: {
    type: String,
    required: true
  }
})

module.exports = model('message', messageSchema)