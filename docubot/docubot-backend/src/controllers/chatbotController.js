const Chatbot = require('../models/Chatbot')

const createChatbot = async(req,res,next) => {
    try{
        const {name,description,industry,language,customization} = req.body;
        if (!name || !industry){
            return res.status(400).json({
                success:false,
                message:"Every field is mandatory"
            })
        }
        const user_id = req.user.id
        const chatbot = await Chatbot.create({
            owner:user_id,
            name,
            description,
            industry,
            language,
            customization
        })

        return res.status(201).json({
            success:true,
            message:'Chatbot created successfully',
            data:chatbot
        })
    }
    catch(err){
        next(err)
    }
}


const getChatbots = async (req, res, next) => {
    const user_id = req.user.id;

    try {
        const data = await Chatbot.find({
            owner: user_id
        });

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {
        next(err);
    }
};

const getChatbot = async(req,res,next)=>{
    try{
        const chatbot = await Chatbot.findOne({
            _id:req.params.id,
            owner:req.user.id
        })
        if (!chatbot) {
            return res.status(404).json({
                success: false,
                message: "Chatbot not found"
            });
        }

        return res.status(200).json({
            success:true,
            data:chatbot
        })
    }
    catch(err){
        next(err)
    }
}

const updateChatbot = async(req,res,next)=>{
    const {name,description,industry,language,customization,status} = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (industry !== undefined) updates.industry = industry;
    if (language !== undefined) updates.language = language;
    if (customization !== undefined) updates.customization = customization;
    if (status !== undefined) {
        const allowedStatuses = ['active','processing','draft','disabled'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success:false,
                message:`status must be one of: ${allowedStatuses.join(', ')}`
            })
        }
        updates.status = status;
    }
    try{
        const chatbot = await Chatbot.findOneAndUpdate({
            _id:req.params.id,
            owner:req.user.id
        },
        updates,
    {
        new:true
    })

            if(!chatbot){
                return res.status(404).json({
                    success:false,
                    message:"Unable to find chatbot"
                })
            }
            return res.status(201).json({
                success:true,
                message:'Chatbot updated successfully',
                data:chatbot
            })
    }

    catch(err){
        next(err)
    }
}

const deleteChatbot = async(req,res,next)=>{
    try{
        const deleted = await Chatbot.findOneAndDelete({
            _id:req.params.id,
            owner:req.user.id
        })

        if(!deleted){
            return res.status(404).json({
                success:false,
                message:'Failed to delete'
            })
        }
        return res.status(200).json({
            success:true,
            message:'Chatbot successfully deleted'
        })
    }
    catch(err){
        next(err)
    }
}


module.exports = {createChatbot,getChatbots,getChatbot,updateChatbot,deleteChatbot};


