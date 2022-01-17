const CustomAPIError = require('./custom')
const { StatusCodes } = require('http-status-codes')

class UnauthenticatedError extends CustomAPIError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnauthenticatedError