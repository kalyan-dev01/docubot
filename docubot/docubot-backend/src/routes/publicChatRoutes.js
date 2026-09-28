const express = require("express");

const router = express.Router();

const {publicChat} = require("../controllers/publicChatController");

router.post("/:chatbotId/chat",publicChat);

module.exports = router;