const { Schema, model } = require('mongoose')

const universitySchema = Schema({
  img: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  professions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'profession'
    }
  ]
})

module.exports = model('university', universitySchema)