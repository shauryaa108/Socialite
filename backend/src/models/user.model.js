import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username: {
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
    refreshtoken: {
        type: String, 
    },
    watchHistory:{
        type : mongoose.Types.ObjectId,
        ref: "Videos"
    }
},{timestamps:true})


//use for encrypting password
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return ;

    this.password = bcrypt.hash(this.password, 10)
    
})

//custom methods
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generate_access_token = function(){
    return  jwt.sign({
        _id : this._id,
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
        _id : this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE
    }
)
}

// we don't pass access token in database we only use them for our use cases

export const User = mongoose.model("User", userSchema)