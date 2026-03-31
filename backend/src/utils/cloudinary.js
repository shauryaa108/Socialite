import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_SECRET_API_KEY, 
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
});   

const uploadOnCloudinary = async (localfilePath)=>{
    
    try {
        if(!localfilePath) return null
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto"
        }) // to uplaode the file on cloudinary using the local path of the file from the server
        // console.log("file uplaoded and the url is ", response.url)
        
        fs.unlinkSync(localfilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localfilePath) //remove the locally saved file from the server by unlinking it as the upload operation failed
        return null;
    }
}

export {uploadOnCloudinary}