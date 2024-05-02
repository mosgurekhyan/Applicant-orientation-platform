const passport = require('passport')

const PASPORT_OPTIONS = {
  successRedirect: process.env.CLIENT_URL,
  failureRedirect: "/login/failed"
}

class AuthController {
  async loginSuccess (req, res) {
    try {
      if (req.user) {
        res.status(200).json({ success: true, message: 'successfull', user: req.user })
      } 
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async logOut (req, res) {
    try {
      req.logout(err => {
        if (err) {
          return res.status(500).json({ message: err.message })
        }
        res.redirect(`${process.env.CLIENT_URL}/selections`)
      })
    } catch (error) {
      res.status(500).json({ message: error.message })  
    }
  }
    
  googleAuth () {
    return passport.authenticate('google', { scope: "openid email profile" })
  }  
  googleCallback () {
    return passport.authenticate('google', PASPORT_OPTIONS) 
  }
}

module.exports = AuthController