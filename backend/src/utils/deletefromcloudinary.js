import {v2 as cloudinary} from "cloudinary";

export const deletefromcloudinary = async(publicId)=>{
    return await cloudinary.uploader.destroy(publicId);
}