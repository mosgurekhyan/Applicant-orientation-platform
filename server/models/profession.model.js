const { Schema, model } = require('mongoose')

const professionSchema = Schema({
  title: {
    type: String,
    required: true
  },
  aboutText: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  tuition: {
    type: Number,
    required: true
  },
  jobs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'job'
    }
  ]
})

module.exports = model('profession', professionSchema)