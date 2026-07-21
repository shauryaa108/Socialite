import { Router } from "express";
import { publishAvideo , getAllVideos, getVideoById, updateVideo, deleteVideo, toggleUploadStatus} from "../controllers/video.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

router.route("/publish").post(verifyJWT,upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]), publishAvideo)
router.route('/').get(getAllVideos)
router.route('/:videoId').get(getVideoById)
router.route('/u/:videoId').patch(verifyJWT,upload.single("thumbnail"), updateVideo)
router.route('/d/:videoId').delete(verifyJWT, deleteVideo)
router.route('/u/t/:videoId').patch(verifyJWT, toggleUploadStatus)

export default router;