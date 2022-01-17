const { StatusCodes } = require('http-status-codes')
const User = require('../model/user')
const { BadRequestError, UnauthenticatedError } = require('../errors')


const register = async (req, res) => {
    const user = await User.create(req.body)
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user: {name: user.name}, token})
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password ){
        throw new BadRequestError('Please Provide Your Email and Password!')
    }
    const user = await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError('Invalid Email')
    }
    //compare password
    const isPassword = user.comparePassword(password)
    if(!isPassword){
        throw new UnauthenticatedError('Invalid Password')
    }
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name: user.name}, token})
}


module.exports = {
    register,
    login
}