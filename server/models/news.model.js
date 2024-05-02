const { Schema, model } = require('mongoose')

const newsSchema = Schema({
  title: {
    type: String,
    required: true
  }
})

module.exports = model('new', newsSchema)