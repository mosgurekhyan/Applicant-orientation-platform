const jwt = require('jsonwebtoken')

const authController = (req, res, next) => {
  const { refreshToken, accessToken } = req.cookies

  if (accessToken) {
    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY, err => {
        if (err) {
          console.error('JWT verification error:', err)
          res.status(403).send('Access denied')
        } else {
          next()
        }
      })
    } catch (error) {
      console.log('Error:',error)
      if (refreshToken) {
        return res.status(401).send('AccessTokenRequired')
      } else {
        return res.status(401).send('LogoutRequired')
      }
    }
  } else if (refreshToken) {
    return res.status(401).send('AccessTokenRequired')
  } else {
    return res.status(401).send('LogoutRequired')
  }
}

module.exports = authController