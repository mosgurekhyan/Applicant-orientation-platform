const { Schema, model } = require('mongoose')

const procedureSchema = Schema({
  img: {
    type: String,
    required: true
  },
  file: {
    type: String, 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('procedure', procedureSchema)