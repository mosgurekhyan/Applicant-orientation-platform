const { Schema, model } = require('mongoose')

const statisticSchema = Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
})

module.exports = model('statistic', statisticSchema)