const roleService = require('../services/role.service')

class RoleController {
  async addRole(req, res) {
    try {
      const {value} = req.body
      const newRole = await roleService.addRole(value)
      res.json({newRole})
    } catch (e) {
      return res.status(500).json({
        message: e.message
      })
    }
  }
}

module.exports = new RoleController()
