import { Router } from "express";
import { isFiles, saveFiles } from "../middlewares/file";
import { upload } from "../utils/multer";
import { createPost } from "../controllers/post";

const router = Router();
router.post(
  "/",
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  isFiles,
  saveFiles,
  createPost
);

export default router;
