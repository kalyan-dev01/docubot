const Document = require("../models/Document");
const Chatbot = require("../models/Chatbot");
const { uploadToRAG,deleteFromRAG } = require("../services/ragService");


// ==========================================================
// Upload Document
// ==========================================================

const uploadDocument = async (req, res, next) => {
    try {

        const { chatbotId } = req.body;


        // --------------------------------------------------
        // Check chatbot ID
        // --------------------------------------------------

        if (!chatbotId) {
            return res.status(400).json({
                success: false,
                message: "Chatbot ID is required"
            });
        }


        // --------------------------------------------------
        // Check uploaded file
        // --------------------------------------------------

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Document file is required"
            });
        }


        // --------------------------------------------------
        // Get logged-in user
        // --------------------------------------------------

        const userId = req.user.id;


        // --------------------------------------------------
        // Verify chatbot belongs to user
        // --------------------------------------------------

        const chatbot = await Chatbot.findOne({
            _id: chatbotId,
            owner: userId
        });

        if (!chatbot) {
            return res.status(404).json({
                success: false,
                message: "Chatbot not found"
            });
        }


        // --------------------------------------------------
        // Create document record in MongoDB
        // --------------------------------------------------

        const document = await Document.create({
            owner: userId,
            chatbot: chatbotId,
            filename: req.file.originalname,
            fileUrl: req.file.path,
            status: "processing"
        });


        // --------------------------------------------------
        // IMPORTANT:
        // Use MongoDB document ID for RAG
        // --------------------------------------------------

        const documentId = document._id.toString();


        try{

        await uploadToRAG(
            req.file.path,
            documentId
        );


        
        }
        catch(ragError){
            document.status = 'failed'
            await document.save();
            console.error('Rag processing failed',ragError.message);
            return res.status(500).json({
                success:false,
                message:'Document processing failed',
                documentId
            });

        }
        document.status = 'ready'

        await document.save();


        return res.status(201).json({
            success: true,
            message: "Document uploaded and processed successfully",
            document
        });

    } catch (err) {

        next(err);
    }
};

const getDocuments = async (req, res, next) => {
    try {

        const userId = req.user.id;


        const documents = await Document.find({
            owner: userId
        })
        .sort({
            createdAt: -1
        })
        .populate(
            "chatbot",
            "name"
        );

        return res.status(200).json({
            success: true,
            count: documents.length,
            data: documents
        });

    } catch (err) {

        next(err);
    }
};

const deleteDocument = async(req,res,next) => {
    try{
        const documentId = req.params.id
        const userId = req.user.id

        const document = await Document.findOne({_id:documentId,owner:userId});
        if(!document){
            return res.status(400).json({
                success:false,
                message:'Document not found'
            })
        }

        await deleteFromRAG(documentId);
        await Document.findByIdAndDelete(documentId);
        return res.status(200).json({
            success:true,
            message:'Document deleted successfully'
        })
    }
    catch(err){
        next(err)
    }
}

module.exports = {
    uploadDocument,getDocuments,deleteDocument
};