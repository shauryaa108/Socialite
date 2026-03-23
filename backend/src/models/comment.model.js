import mongoose , {Schema} from "mongoose";
import { Video } from "./video.model.js";
import { User } from "./user.model.js";

const commentSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true
    },
    video : {
        type: mongoose.Types.ObjectId,
        ref : Video,
        required : true
    },
    owner : {
        type : mongoose.Types.ObjectId,
        ref : User,
        required : true
    }

}, {timestamps : true})

export const Comment = mongoose.model("Comment", commentSchema)