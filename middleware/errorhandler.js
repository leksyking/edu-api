const { StatusCodes } = require("http-status-codes")


const errorHandlerMiddleware = (err, req, res, next) => {
    //default
   let customError = {
       status: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
       message: err.message || 'Something went wrong, try again later'
      }
   //Check The Registration parameters
   if (err.name === 'ValidationError'){
      customError.status = 400,
      customError.message = Object.values(err.errors).map((item) => item.message).join(', ')
   }
   //check for duplicate mails
   if(err.code && err.code === 11000){
       customError.status = 400,
       customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please enter another Email! `
   }
   //check for casterror in your Id
   if(err.name === 'CastError'){
       customError.status = 400,
       customError.message = `There is an error in your Id: ${err.value}`
   }
   return res.status(customError.status).json({msg: customError.message})
}

module.exports = errorHandlerMiddleware