const userModel = require("../models/user.model")
const nodemailer = require('nodemailer')

const createOTP = async (name, email) => {
  try {
    let digits = '0123456789'
    let OTP = ''
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)]
    }
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWORD
      }
    })

    const info = {
      to: email,
      subject: 'Verify your email...',
      html: `<p>Hi ${name}, ${OTP} is your Register OTP from Sir's Diplom.</p>`
    }
  
    await transporter.sendMail(info)
    return OTP
  } catch (smtpError) {
    console.error('SMTP Error:', smtpError.message)
  }
}

class RegisterService {
  constructor (models) {
    this.models = models
  }

  async userRegister (body) {
    const { email, fullName } = body
    const existingUser = await this.models.users.findOne({ email })

    if (existingUser) {
      return { message: "այս էլեկտրոնային հասցեով արդեն կա գրանցված օգտատեր" }
    } else {
      const newUser = new this.models.users({ ...body })
      if (email === process.env.ADMIN_EMAIL) {
        newUser.role = 'admin'
      }
      if (email === process.env.REDACTOR_EMAIL) {
        newUser.role = 'redactor'
      }
      await newUser.save()
      if (!newUser.isVerified) {
        const OTP = await createOTP(fullName, email)
        return { OTP, email }
      } else {
        return newUser
      }
    }
  }

  async sendOtp (body) {
    const { email } = body
    const user = await userModel.findOne({ email })
    const OTP = await createOTP(user.fullName, email)
    return OTP
  }

  async verifyEmail (email) {
    const user = await userModel.findOne({ email })
    if (user.isVerified === false) {
      user.isVerified = true
      await user.save()
    }
    
    return user
  } 
}

module.exports = RegisterService