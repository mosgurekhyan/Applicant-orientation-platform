const { Schema, model } = require('mongoose')

const jobSchema = Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('job', jobSchema)