const { ApplicationError } = require('./applicationError'); 

class CategoryNotFoundError extends ApplicationError {
  constructor(message) {
    super(message || 'No category found.', 404);
  }
}

class CategoryInvalidContent extends ApplicationError {
  constructor(message) {
    super(message || 'Provide valid json data./name/', 400);
  }
}

class CategoryExists extends ApplicationError {
  constructor(message) {
    super(message || 'Category with name exists', 400)
  }
}

class FetchCategoryFailed extends ApplicationError {
  constructor(message) {
    super(message || 'Unable to fetch category at this time. Please try again later.', 400)
  }
}

class FetchCategoriesFailed extends ApplicationError {
  constructor(message) {
    super(message || 'Unable to fetch categories at this time. Please try again later.', 400)
  }
}

module.exports = { 
  CategoryNotFoundError,
  CategoryInvalidContent,
  CategoryExists,
  FetchCategoryFailed,
  FetchCategoriesFailed
}