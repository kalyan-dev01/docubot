const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    try{
        connection = await mongoose.connect(process.env.mongourl)
        console.log("Database connection established")
    }
    catch(err){
        console.error("Mongodb connection failed :",err.message)
    }
}

module.exports = {connectDB}
