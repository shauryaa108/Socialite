import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// define cors
app.use(cors(
    {
        origin : process.env.CORS_ORIGIN,
        credentials: true,
        optionsSuccessStatus : 200
    }
))

// configurations
app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("Public"))
app.use(cookieParser())


export {app}