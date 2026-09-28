const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const userRouter = require('./routes/userRoutes');
const Chatrouter = require('./routes/chatbotRoutes');
require('dotenv').config()
const documentRoutes = require('./routes/documentRoutes')
const chatRoutes = require("./routes/chatRoutes");
const publicChatRoutes = require('./routes/publicChatRoutes');
const app = express()

app.use(cors());
app.use(express.json())
app.use('/user',userRouter)
app.use('/api/chatbots',Chatrouter)
app.use("/api/documents", documentRoutes);
app.use("/api/chatbots", chatRoutes);
app.use("/api/public/chatbots", publicChatRoutes);


app.get('/',(req,res)=>{
    res.json({
        "message":'DocuBot backend is running'
    })
})



app.use(errorHandler);

module.exports = app;