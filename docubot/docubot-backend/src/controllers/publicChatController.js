const Chatbot = require("../models/Chatbot");
const Document = require("../models/Document");
const { askRAG } = require("../services/ragService");


// ==========================================================
// Public Chat
// ==========================================================

const publicChat = async (req, res, next) => {
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
        // Find chatbot
        // --------------------------------------------------

        const chatbot = await Chatbot.findById(
            chatbotId
        );

        if (!chatbot) {
            return res.status(404).json({
                success: false,
                message: "Chatbot not found"
            });
        }


        // --------------------------------------------------
        // Check chatbot status
        // --------------------------------------------------

        if (chatbot.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Chatbot is not available"
            });
        }


        // --------------------------------------------------
        // Find chatbot's ready document
        // --------------------------------------------------

        const document = await Document.findOne({
            chatbot: chatbotId,
            status: "ready"
        });


        if (!document) {
            return res.status(404).json({
                success: false,
                message: "No ready document found for this chatbot"
            });
        }


        // --------------------------------------------------
        // Ask RAG
        // --------------------------------------------------

        const result = await askRAG(
            question.trim(),
            document._id.toString()
        );


        // --------------------------------------------------
        // Return answer
        // --------------------------------------------------

        return res.status(200).json({
            success: true,
            question: result.question,
            response: result.response
        });
    } catch (err) {
        next(err);
    }
};


module.exports = {
    publicChat
};