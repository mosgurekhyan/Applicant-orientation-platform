const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = Schema({
  fullName: {
    type: String,
    required: true
  }, 
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: [ 'admin', 'redactor', 'դիմորդ', 'բակալավրի ուսանող', 'մագիստրտուրայի ուսանող' ]
  },
  professions: {
    type: Array
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  savedProfessions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'profession'
    }
  ],
  googleId: {
    type: String,
    default: null
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
})

userSchema.pre('save', function (next) {
  try {
    if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password, 10)
    }
    next ()
  } catch (error) {
    next (error)
  }
})

userSchema.statics.login = async function (email, password) {
  try {
    const user = await this.findOne({ email })
    if (!user) {
      throw new Error("Invalid email or password. Please try again.")
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error(`Invalid email or password. Please try again.`)
    }

    if (!user.isVerified) {
      throw new Error(`email isn't verified`)
    }

    return user
  } catch (error) {
    throw error
  }
}

module.exports = model('user', userSchema)