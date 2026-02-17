import { HandleAsync } from "../utils/HandleAsync.js";

const registerUser = HandleAsync(async (req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({
            message: "Both credentials aren't provided"
        })
    }
    res.status(201).json({
        message: "User registered succesfully",
        email
    })
})
// use the status code visely it might fuck the hwole postman request

export {registerUser}