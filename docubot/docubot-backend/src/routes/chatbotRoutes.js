const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createChatbot, getChatbots, getChatbot, updateChatbot, deleteChatbot } = require('../controllers/chatbotController');
const Chatrouter = express.Router();

Chatrouter.post('/',authMiddleware,createChatbot);
Chatrouter.get('/',authMiddleware,getChatbots);
Chatrouter.get('/:id',authMiddleware,getChatbot);
Chatrouter.patch('/update/:id',authMiddleware,updateChatbot);
Chatrouter.delete('/delete/:id',authMiddleware,deleteChatbot);




module.exports = Chatrouter;
