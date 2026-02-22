import { HandleAsync } from "../utils/HandleAsync.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accesstoken = user.generate_access_token()
        const refreshtoken = user.generate_refresh_token()

        user.refreshtoken = refreshtoken
        await user.save({ validateBeforeSave: false })

        return {accesstoken, refreshtoken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = HandleAsync(async (req, res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    const {fullName, email, password, username} = req.body
    if(!email || !password){
        return res.status(400).json({
            message: "Both credentials aren't provided"
        })
    }

    if([fullName, email, password, username].some((field) => field?.trim() === "")){
        throw new ApiError(400, "all the fields are required")
    }
    const alreadyExist = await User.findOne({
        $or : [{ username }, { email }]
    })
    if(alreadyExist){
        throw new ApiError(409, "User Already exist")
    }
    // file - avatar
    const avatarFilePath = req.files?.avatar[0]?.path
    // classsic method, and we do it because coverimage is optional so we are checking if we have coverimage or not, if we
    // don't have the cover image then we will just check it here as it is
    let coverImagePath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImagePath = req.files.coverImage[0].path
    }


    if(!avatarFilePath){
        throw new ApiError(400, "Didn't recieved avatar, kindly fill the mandatory field")
    }

    const avatar =  await uploadOnCloudinary(avatarFilePath)
    if(!avatar){
        throw new ApiError(500, "wasn't able to upload avatar")
    }
    const coverImage = await uploadOnCloudinary(coverImagePath)

    const user = await User.create({
        fullName,
        email,
        username: username.toLowerCase(),
        avatar : avatar.url,
        coverImage: coverImage?.url || "",
        password
    })
    const registeredUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!registeredUser){
        throw new ApiError(500, "Something went wrong while registering user")
    }
    return res.status(200).json(
        new ApiResponse(200, registeredUser, "User created succesfully")
    )
})

const loginUser = HandleAsync(async (req, res) => {
    //---------more better algorithm----------------//
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {username, email, password} = req.body
    if(!username && !email){
        throw new ApiError(404, "Both username and password required")
    }
    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    if(!user){
        throw new ApiError(404, "User does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(404, "wrong user password")
    }

    const {accesstoken , refreshtoken} = await generateAccessAndRefereshTokens(user?._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshtoken")

    if(!loggedInUser){
        throw new ApiError(404, "User isn't logged in")
    }

    const options = {
        httpOnly: true,
        secure:true
    }

    return res
    .status(200)
    .cookie( "accesstoken" , options)
    .cookie( "refreshtoken" , options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accesstoken, refreshtoken
            },
            "User Logged in successfully"
        )
    )

})

const loggedout = HandleAsync(async (req, res)=>{
    // made a route for login, logout, when logining in, just tinject this fucntion
    // when loggin out, inject the middleware, to identify which user to log out then implement the log out funtionality using this fucn
    // basic structure
    // route -> login, logout(with middleware)
    // middleware -> verifyJwt to check which user to deelete
    // remove cookies and refresh the refresh token
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie( "accesstoken" , options)
    .clearCookie( "refreshtoken" , options).json(
        new ApiResponse(
            200,
            {},
            "User logged out successfully"
        )
    )
})

const refreshAccessToken = HandleAsync(async (req, res)=>{
    const incomingRefreshToken = req.cookies.refreshtoken || req.body.refreshtoken
    if(!incomingRefreshToken){
        throw new ApiError(401, "invalid refresh token")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(400, "Token expired or used")
        }
    
        if(incomingRefreshToken !== user.refreshtoken){
            throw new ApiError(404, "This token was invalid")
        }
        const {accesstoken, newRefreshToken} = generateAccessAndRefereshTokens(decodedToken?._id)
    
        const option = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .cookie("accesstoken", accesstoken , option)
        .cookie("refreshtoken", newRefreshToken, option)
        .json(
            new ApiResponse(
                200,
                {accesstoken, refreshtoken: newRefreshToken},
                "access token is refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(400, error?.message || "Invalid refresh token")
    }
})

// use the status code visely it might fuck the whole postman request

export {
    registerUser,
    loginUser,
    loggedout,
    refreshAccessToken
}