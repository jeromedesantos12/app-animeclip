import cookieParser from "cookie-parser";
import express from "express";
import http from "http";
import { resolve } from "path";
import { config } from "dotenv";
import { errorHandler } from "./middlewares/error";
import { corsMiddleware } from "./utils/cors";
import router from "./routes";

config();

const url = process.env.BASE_URL;
const port = new URL(url as string).port;
const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(express.json());
app.use(corsMiddleware);
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/uploads", express.static(resolve(process.cwd(), "uploads")));

app.use(router);
app.use(errorHandler);

server.listen(port, () =>
  console.log(`
    ░█████╗██╗░░██╗
    ██╔══██╗██║░██╔╝
    ██║░░██║█████═╝░
    ██║░░██║██╔═██╗░
    ╚█████╔╝██║░╚██╗
    ░╚════╝░╚═╝░░╚═╝
    
    𝗟𝗼𝗰𝗮𝗹: ${url}
    `)
);
