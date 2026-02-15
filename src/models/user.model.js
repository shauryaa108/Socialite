import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required:true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required:true,
        unique: true,
    },
    fullName: {
        type: String,
        required:true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // cloudnary link
        required:true,
    },
    coverImage: {
        type: String, // cloudnary link
    },
    password: {
        type: String, 
        required:true,
    },
    refreshToken: {
        type: String, 
    },
    watchHistory:{
        type : mongoose.Types.ObjectId,
        ref: "Videos"
    }
},{timestamps:true})


//use for encrypting password
userSchema.pre("save", async function(next){
    if(!this.inModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()
})

//custom methods
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generate_access_token = function(){
    return  jwt.sign({
        userId : this.userId,
        username : this.username,
        email: this.email,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE
    }
)
}

// refresh tokens take less information
userSchema.methods.generate_refresh_token =  function(){
    return jwt.sign({
        userId : this.userId
    },
    process.env.ACCESS_REFRESH_SECRET,
    {
        expiresIn: process.env.ACCESS_REFRESH_EXPIRE
    }
)
}

export const User = mongoose.model("User", userSchema)