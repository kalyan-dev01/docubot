const Chatbot = require("../models/Chatbot");
const Document = require("../models/Document");
const { askRAG } = require("../services/ragService");


const askQuestion = async (req, res, next) => {
    try {

        const { chatbotId } = req.params;
        const { question } = req.body;


        // --------------------------------------------------
        // Validate question
        // --------------------------------------------------

        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Question is required"
            });
        }


        // --------------------------------------------------
        // Find chatbot belonging to logged-in user
        // --------------------------------------------------

        const chatbot = await Chatbot.findOne({
            _id: chatbotId,
            owner: req.user.id
        });

        if (!chatbot) {
            return res.status(404).json({
                success: false,
                message: "Chatbot not found"
            });
        }


        // --------------------------------------------------
        // Find a ready document
        // --------------------------------------------------

        const document = await Document.findOne({
            chatbot: chatbotId,
            owner: req.user.id,
            status: "ready"
        }).sort({
            createdAt: -1
        });


        if (!document) {
            return res.status(404).json({
                success: false,
                message: "No ready document found for this chatbot"
            });
        }


        // --------------------------------------------------
        // IMPORTANT:
        // Use the MongoDB document ID
        // --------------------------------------------------

        const documentId = document._id.toString();
        

        // --------------------------------------------------
        // Ask Python RAG using SAME document ID
        // --------------------------------------------------

        const result = await askRAG(
            question.trim(),
            documentId
        );


        // --------------------------------------------------
        // Return response
        // --------------------------------------------------

        return res.status(200).json({
            success: true,
            question: result.question,
            response: result.response
        });

    } catch (err) {

        console.error(
            "Chat request failed:",
            err
        );

        next(err);
    }
};


module.exports = {
    askQuestion
};