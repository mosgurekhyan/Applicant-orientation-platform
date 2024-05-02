const { Schema, model } = require('mongoose')

const chatSchema = Schema({
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'message'
    }
  ]
})

module.exports = model('chat', chatSchema)