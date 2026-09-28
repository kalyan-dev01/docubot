const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {uploadDocument, getDocuments,deleteDocument} = require("../controllers/documentController");

router.post("/",authMiddleware,upload.single("document"),uploadDocument);
router.get('/',authMiddleware,getDocuments);
router.delete('/delete/:id',authMiddleware,deleteDocument);


module.exports = router;