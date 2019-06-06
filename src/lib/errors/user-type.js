const { ApplicationError } = require('./applicationError'); 

class UserTypeNotFoundError extends ApplicationError {
  constructor(message) {
    super(message || 'No User type found.', 404);
  }
}

class UserTypeInvalidContent extends ApplicationError {
  constructor(message) {
    super(message || 'Provide valid json data. /name/', 400);
  }
}

class UserTypeExists extends ApplicationError {
  constructor(message) {
    super(message || 'User type already exist', 400)
  }
}

class FetchUserTypeFailed extends ApplicationError {
  constructor(message) {
    super(message || 'Unable to fetch user type at this time. Please try again later.', 400)
  }
}

class FetchUserTypesFailed extends ApplicationError {
  constructor(message) {
    super(message || 'Unable to fetch user types at this time. Please try again later.', 400)
  }
}

module.exports = { 
  UserTypeNotFoundError,
  UserTypeInvalidContent,
  UserTypeExists,
  FetchUserTypeFailed,
  FetchUserTypesFailed
}