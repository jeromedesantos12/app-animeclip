import cors from "cors";
import { config } from "dotenv";

config();

const ORIGIN_URL = process.env.ORIGIN_URL as string;

export const corsMiddleware = cors({
  origin: [ORIGIN_URL],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
});
