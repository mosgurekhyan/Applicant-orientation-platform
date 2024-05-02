const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

class LoginController {
  async userLogin (req, res) {
    try {
      const { email } = req.body
      const candidate = await userModel.findOne({ email })
      const user = await req.app.services.login.userLogin(req.body)
      const accessToken = jwt.sign({ userId: candidate._id }, process.env.ACCESS_TOKEN_PRIVATE_KEY)
      const refreshToken = jwt.sign({ userId: candidate._id }, process.env.REFRESH_TOKEN_PRIVATE_KEY)
      res
      .cookie('accessToken', accessToken, { httpOnly: true, secure: true, maxAge: 900000 })
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 2592000000 })
      .json(user)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
    
  async refreshToken (req, res) {
    const { refreshToken } = req.cookies
    if (!refreshToken) {
      return res.status(401).send('Access Denied. No refresh token provided.')
    } else {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY)
      const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_PRIVATE_KEY)
      await res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, maxAge: 900000 })
      await res.send('New access token successfully created.')
    }
  }
    
  async changePassword (req, res) {
    try {
      const user = await req.app.services.login.changePassword(req.body)
      res.json(user)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = LoginController