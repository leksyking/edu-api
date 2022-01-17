const mongoose = require('mongoose')

const docSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: [true, 'Please enter the Title of your Document']
    },
    Language:{
        type: String,
        required: [true, 'Enter your Programming Language']
    },
    position:{
        type: String,
        required: [true, 'Please provide a position']
    },
    post: {
        type: String,
        required: [true, 'Please provide your post'],
        maxlength: 250
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide User']
    }
},
    { timestamps: true}
)




const Docs = mongoose.model('Docs', docSchema)

module.exports = Docs