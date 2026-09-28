const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { askQuestion } = require("../controllers/chatController");

router.post(
    "/:chatbotId/chat",
    authMiddleware,
    askQuestion
);

module.exports = router;