class ApplicationError extends Error {
    constructor(message,status) {
        super()
        Error.captureStackTrace(this, this.constructor)
        this.name = this.constructor.name
        this.message = message || 
        'Something went wrong. Please try again.'
        this.status = status || 500
    }
}

class InternalServerError extends ApplicationError {
    constructor(message) {
        super(message || `Oops this is not you, It's us. Our engineers will fix it.` , 500)
    }
}

module.exports =  {
    ApplicationError,
    InternalServerError
}