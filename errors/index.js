const CustomAPIError = require('./custom')
const BadRequestError = require('./badrequest')
const NotFoundError = require('./badrequest')
const UnauthenticatedError = require('./unauthenticated')

module.exports = {
    CustomAPIError,
    BadRequestError,
    NotFoundError,
    UnauthenticatedError
}