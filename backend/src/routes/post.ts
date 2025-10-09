import { Router } from "express";
import {
  auth,
  isExistPost,
  isExistPostRestore,
  isSameBody,
} from "../middlewares/auth";
import { isFiles, saveFiles } from "../middlewares/file";
import { upload } from "../utils/multer";
import {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  restorePost,
} from "../controllers/post";

const router = Router();

router.get("/", auth, getPosts);
router.get("/:id", auth, getPostById);
router.post(
  "/",
  auth,
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  isFiles,
  saveFiles,
  createPost
);
router.put("/:id", auth, isExistPostRestore("post"), isSameBody, restorePost);
router.delete("/:id", auth, isExistPost("post"), isSameBody, deletePost);

export default router;
