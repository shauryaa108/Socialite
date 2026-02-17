import multer from "multer"

// uploading on disk strong rather than temp memory storage
const FileUsingMulter = multer.diskStorage({
    destination : function (req, file, cb){
        cb(null, "./public/temp")
    },
    filename : function (req, file, cb){
        cb(null, file.originalname)
    }
})

export const upload = multer({storage : FileUsingMulter})

// Here we are creating a custom storage engine using multer.diskStorage().
// Instead of using default destination behavior, we define:
// 1. Where the file should be stored (destination)
// 2. What the filename should be (filename)
//
// When we use upload.single("fieldname"),
// multer middleware parses the incoming multipart/form-data request,
// then internally calls the destination() and filename() functions,
// saves the file to disk, and attaches the file info to req.file.
