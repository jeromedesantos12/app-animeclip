import { Router } from "express";
import { auth, isSame, isExist, isExistRestore } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { saveFiles } from "../middlewares/file";
import { upload } from "../utils/multer";
import { updateUserSchema } from "../utils/joi";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  restoreUser,
} from "../controllers/user";

const router = Router();

router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.patch(
  "/:id",
  auth,
  isSame,
  isExist("user"),
  upload.fields([
    { name: "avatar_url", maxCount: 1 },
    { name: "banner_url", maxCount: 1 },
  ]),
  validate(updateUserSchema),
  saveFiles,
  updateUser
);
router.put("/:id", auth, isSame, isExistRestore("user"), restoreUser);
router.delete("/:id", auth, isSame, isExist("user"), deleteUser);

export default router;
