const { ApplicationError } = require('./applicationError'); 

class UserNotFoundError extends ApplicationError {
  constructor(message) {
    super(message || 'No User found.', 404);
  }
}

class UserInvalidContent extends ApplicationError {
  constructor(message) {
    super(message || 'Provide valid json data. /name, email, password, user_type, audience/', 400);
  }
}

class InvalidCredentials extends ApplicationError {
  constructor(message) {
    super(message || 'Invalid credentials', 400)
  }
}

class UserExists extends ApplicationError {
  constructor(message) {
    super(message || 'There is a user registered with this email', 400)
  }
}

class FetchUserFailed extends ApplicationError {
  constructor(message) {
    super(message || 'Unable to fetch user at this time. Please try again later.', 400)
  }
}

class FetchUsersFailed extends ApplicationError {
  constructor(message) {
    super(message || 'Unable to fetch users at this time. Please try again later.', 400)
  }
}

module.exports = {
  UserNotFoundError,
  UserInvalidContent,
  InvalidCredentials,
  UserExists,
  FetchUserFailed,
  FetchUsersFailed
}