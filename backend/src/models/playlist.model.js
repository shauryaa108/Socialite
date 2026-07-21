import mongoose, {Schema} from "mongoose";
import { Video } from "./video.model";
import { User } from "./user.model";

const playlistSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    videos : [
        {
            type : mongoose.Types.ObjectId,
            ref : "Video"
        }
    ],
    owner : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    }
}, {timestamps : true})

export const Playlist = mongoose.model("Playlist", playlistSchema)