const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [ true, 'Please enter your name!' ]
    },
    email:{
        type: String,
        required: [ true, 'Please enter your email!' ],
         match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
            'Please provide Valid email'],
        unique: true
    },
    password:{
        type: String,
        required: [ true, 'Please enter your password!' ]
    }
})

//Hash Password
userSchema.pre('save', async function() {
   const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

//create a token
userSchema.methods.createJWT = function(){
   return jwt.sign({userId: this._id, name: this.name}, process.env.SECRET, {expiresIn: process.env.LIFETIME})
}

//compare password
userSchema.methods.comparePassword = async function(passwordEntered) {
    const isMatch = await bcrypt.compare(passwordEntered, this.password)
    return isMatch
}


const User = mongoose.model('User', userSchema)

module.exports = User