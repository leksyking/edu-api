const { StatusCodes } = require('http-status-codes')
const Docs = require('../model/docs')
const { BadRequestError, NotFoundError} = require('../errors')

const getAllDocs = async (req, res) => {
    const docs = await Docs.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({docs, nBHits: docs.length})
}
const createDoc = async (req, res) => {
    req.body.createdBy = req.user.userId
    const doc = await Docs.create(req.body)
    res.status(StatusCodes.CREATED).json({doc});
  
}
const getDoc = async (req, res) => {
   const { params:{id: docId},
           user:{userId: userId}
        } = req
    const doc = await Docs.findOne({_id: docId, createdBy: userId})
    if(!doc){
        throw new NotFoundError(`No doc with ${docId}`)
    }
    res.status(StatusCodes.OK).json({doc})
}
const updateDoc = async (req, res) => {
    const { body:{Title, Language, post },
           params:{id: docId},
           user:{userId: userId}
        } = req
    if(Title === '' || Language === '' || post === ''){
            throw new BadRequestError('The Title, Language and post fields cannot be empty')
        }
    const doc = await Docs.findByIdAndUpdate({_id: docId, createdBy: userId}, req.body, {new: true, runValidators: true})
    if(!doc){
        throw new NotFoundError(`No doc with ${docId}`)
    }
    res.status(StatusCodes.OK).json({doc})
}
const deleteDoc = async (req, res) => {
    const { params:{id: docId},
           user:{userId: userId}
        } = req
    const doc = await Docs.findByIdAndRemove({_id: docId, createdBy: userId })
    if(!doc){
        throw new NotFoundError(`No doc with ${docId}`)
    }
    res.status(StatusCodes.OK).json({msg: 'Success'})
}


module.exports = {
    getAllDocs,
    createDoc,
    getDoc,
    updateDoc,
    deleteDoc
}