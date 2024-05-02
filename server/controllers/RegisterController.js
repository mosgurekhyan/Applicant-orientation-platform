class RegisterController {
  async userRegister (req, res) {
    try {
      const newUser = await req.app.services.register.userRegister(req.body)
      res.json(newUser)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  
  async verifyEmail (req, res) {
    const { email } = req.body
    try {
      const user = await req.app.services.register.verifyEmail(email)
      res.json(user)
    } catch (error) {
      res.status(500).json({ message: error.message})
    }
  }
  
  async sendOtp (req, res) { 
    try {
      const request = await req.app.services.register.sendOtp(req.body)
      res.json(request)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}    
  
module.exports = RegisterController