const mongoose = require('mongoose');

const chatBotSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    industry:{
        type:String,
        trim:true,
        required:true
    },
    language:{
        type:String,
        default:"English",
        trim:true
    },
    status:{
        type:String,
        enum:['active','processing','draft','disabled'],
        default:'draft'
    },
    customization:{
    primary_color: {
        type: String,
        default: "#2563eb",
        trim: true
    },
        welcome_message:{
            type:String,
            default:"Hi! How can i help you?"
        },
        chatbot_title:{
            type:String,
            default:'AI Assistant',
            trim:true
        }
    }
},{timestamps:true})

const Chatbot = mongoose.model('Chatbot',chatBotSchema);

module.exports = Chatbot;

