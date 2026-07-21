import mongoose from "mongoose";
import { User } from "./user.model.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";

const videoSchema = new mongoose.Schema({
    videoUrl: {
        type: String, // cloudnary url
        required:true,
    },
    thumbnail: {
        type: String, // cloudnary url
        required:true,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required:true,
        trim: true,
        index: true
    },
    title: {
        type: String,
        required:true,
    },
    description: {
        type: String,
    },
    duration: {
        type: Number, //cloudnary too
        required:true,
    },
    views: {
        type: Number, 
        default: 0
    },
    isPublished:{
        type : Boolean,
        default:true
    }
},
{
    timestamps:true
})


videoSchema.plugin(mongooseAggregatePaginate)


export const Video = mongoose.model("Video", videoSchema)