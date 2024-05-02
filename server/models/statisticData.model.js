const { Schema, model } = require('mongoose')

const statisticDataSchema = Schema({
  img: {
    type: String, 
    required: true
  },
  title: {
    type: String, 
    required: true
  }
})

module.exports = model('statisticData', statisticDataSchema)