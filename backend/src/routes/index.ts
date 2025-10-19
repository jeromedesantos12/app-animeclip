import { Router } from "express";
import { notFound } from "../middlewares/notFound";
import post from "../routes/post";

const api = Router();
const router = Router();
const version = process.env.API_VERSION;

api.use("/post", post);
api.use("*catchall", notFound);

router.use(`/api/${version}`, api);

export default router;
