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
app.use(express.static("Public"))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true, limit:"16kb"}))
// route import

import {router as userReg} from "./routes/user.route.js"
import {router as commentReg} from "./routes/comment.route.js"
import videoRouter from "./routes/video.routes.js";
import likesRouter from "./routes/likes.routes.js";
import playlistRouter from "./routes/playlist.route.js";
import subscriptionRouter from "./routes/subscription.route.js";
import tweetRouter from "./routes/tweet.route.js";
import dashboardRouter from "./routes/dashboard.route.js";

app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/likes", likesRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/user", userReg)
app.use("/api/v1/comment", commentReg)

export {app}