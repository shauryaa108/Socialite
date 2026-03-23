import mongoose, {Schema} from "mongoose";
import { Comment } from "./comment.model";
import { Video } from "./video.model";
import { User } from "./user.model";
import { Tweet } from "./tweet.model";

const likeSchema = new mongoose.Schema({
    comment : {
        type : mongoose.Types.ObjectId,
        ref : Comment
    },
    video : {
        type : mongoose.Types.ObjectId,
        ref : Video
    },
    likedBy : {
        type : mongoose.Types.ObjectId,
        ref : User
    },
    tweet : {
        type : mongoose.Types.ObjectId,
        ref : Tweet
    }
}, {timestamps : true})

export const Like = mongoose.model("Like", likeSchema)