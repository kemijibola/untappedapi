const { ApplicationError } = require('./applicationError'); 


class UploadInvalidContent extends ApplicationError {
  constructor(message) {
    super(message || 'No media uploaded', 400);
  }
}

class UploadInvalidFile extends ApplicationError {
  constructor(message) {
    super(message || 'Invalid file', 400)
  }
}

module.exports = { 
  UploadInvalidContent,
  UploadInvalidFile
}