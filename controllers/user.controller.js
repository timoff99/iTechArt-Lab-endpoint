const userService = require('../services/user.service')

class UserController {
  async getUser(req, res) {
    console.log('req.user', req.user)
    const user = await userService.getUser(req.user.id)
    return res.json({user})
  }
}

module.exports = new UserController()
