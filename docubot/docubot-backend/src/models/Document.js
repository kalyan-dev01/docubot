const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    chatbot:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chatbot",
        required:true
    },
    filename:{
        type:String,
        required:true,
        trim:true
    },
    fileUrl:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['ready','uploaded','failed','processing'],
        default:'uploaded'
    }
},{timestamps:true})

const Document = mongoose.model('Document',documentSchema)

module.exports = Document