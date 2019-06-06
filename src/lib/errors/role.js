const { ApplicationError } = require('./applicationError'); 

class RoleNotFoundError extends ApplicationError {
  constructor(message) {
    super(message || 'No role found.', 404);
  }
}

class RoleInvalidContent extends ApplicationError {
  constructor(message) {
    super(message || 'Provide valid json data./name, user_type, role_type/', 400);
  }
}

class RoleExists extends ApplicationError {
  constructor(message) {
    super(message || 'Role with name exists', 400)
  }
}

class FetchRoleFailed extends ApplicationError {
  constructor(message) {
    super(message || 'Unable to fetch role at this time. Please try again later.', 400)
  }
}

class FetchRolesFailed extends ApplicationError {
  constructor(message) {
    super(message || 'Unable to fetch roles at this time. Please try again later.', 400)
  }
}

module.exports = { 
  RoleNotFoundError,
  RoleInvalidContent,
  RoleExists,
  FetchRoleFailed,
  FetchRolesFailed
}