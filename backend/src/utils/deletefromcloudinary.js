import {v2 as cloudinary} from "cloudinary";

const deletefromcloudinary = async(publicId)=>{
    return await cloudinary.uploader.destroy(publicId);
}

export default deletefromcloudinary