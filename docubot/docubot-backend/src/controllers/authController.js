const bcrypt = require('bcrypt')
const User = require('../models/User')
const validator = require('validator');
const jwt = require('jsonwebtoken')
require('dotenv').config()


const signUp = async(req,res,next)=>{
    try{
        const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.json({message:"Name,email and password are required"});
    }
    const isValidEmail = validator.isEmail(email)
    if (!isValidEmail){
        return res.json({
            success:false,
            message:"Enter valid email"
        })
    }

    const existingUser = await User.findOne({'email':email})
    if (existingUser){
        return res.status(409).json({
            success:false,
            message:'Email already exist'
        })
    }

    const isStrongPassword = validator.isStrongPassword(password,{minLength:8,minSymbols:1,minNumbers:1});
    if(!isStrongPassword){
        return res.status(401).json({
            success:false,
            message:'Minimum length of password should be 8 and it should contain atleast 1 symbol and 1 Number'
        })
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await User.create({
        name,
        email,
        password:hashedPassword
    })
    const payload = {
        id:user._id,
        email:user.email
    }
    const token = jwt.sign(payload,process.env.secret,{expiresIn:'1d'});
    res.status(201).json({
        message:"Account created successfully",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            token:token
        }
    })
    }
    catch(err){
        next(err)
    }
}

const login = async(req,res,next)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(404).json({
                success:false,
                message:"Email and password are mandatory"
            })
        }
        const user = await User.findOne({"email":email})
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User didn't exist"
            })
        }
        const ValidPassword = await bcrypt.compare(password,user.password);
        if(!ValidPassword){
            return res.status(401).json({
                success:false,
                message:"Invalid password"
            })
        }
        payload = {id:user._id,email:user.email}
        const token = jwt.sign(payload,process.env.secret,{expiresIn:'1d'})
        return res.status(200).json({
            success:true,
            message:"Logged in",
            token:token
        })
    }
    catch(err){
        next(err)
    }
}


const getMe = async(req,res,next)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        if(!user){
            return res.status(404).json({
                success:false,
                message:'User not found'
            })
        }
        return res.status(200).json({
            success:true,
            data:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        })
    }
    catch(err){
        next(err)
    }
}

module.exports = {signUp,login,getMe}