const Role = require("../models/Role");

class RoleService {
  async addRole(value) {
    const role = new Role({value})
    return await role.save()
  }
}

module.exports = new RoleService()
