class LoginService {
  constructor (models) {
    this.models = models
  }

  async userLogin (body) {
    const { email, password } = body
    const user = await this.models.users.login(email, password)
    if (user) return user
  }

  async changePassword (body) {
    const { newPassword, email } = body
    const user = await this.models.users.findOne({ email })
    user.password = newPassword
    await user.save()
    return user
  }
}

module.exports = LoginService