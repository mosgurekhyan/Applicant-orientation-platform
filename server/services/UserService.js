class UserService {
  constructor (models) {
    this.models = models
  }

  async findWithGoogleId (googleId) {
    const existingUser = this.models.users.findOne({ googleId })
    return existingUser
  }

  async saveProfession ({ userId, professionId }) {
    const user = await this.models.users.findById(userId)
    const isProfessionSaved = user.savedProfessions.some(savedProfession => savedProfession.equals(professionId))

    let updatedUser
    if (isProfessionSaved) {
      updatedUser = await this.models.users.findByIdAndUpdate(
        userId,
        { $pull: { savedProfessions: professionId } },
        { new: true }
      ).populate('savedProfessions')
    } else {
      updatedUser = await this.models.users.findByIdAndUpdate(
        userId,
        { $addToSet: { savedProfessions: professionId } },
        { new: true }
      ).populate('savedProfessions')
    }

    return updatedUser
  }

  async getUniqueUser (_id) {
    const user = await this.models.users.findById(_id).populate('savedProfessions')
    return user
  }
}

module.exports = UserService