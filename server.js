import express from "express"
import { config } from "dotenv"
import morgan from "morgan"
import parser from "body-parser"
import multer from "multer"
import path from "path"
import { user } from "./routers/userRouter.js"
import { blog } from "./routers/blogRouter.js"
import {rateLimit} from "express-rate-limit"
import { createConnection } from "./connection.js"
import mongoose from "mongoose";
import { comment } from "./routers/commentRouter.js"
config()
const PORT = process.env.PORT

const rateConfig = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 dq,
    limit: 1000,
    standardHeaders: "draft-6",
    legacyHeaders: false,
    message: "<p>Express many requests</p>"
})



const directory =  path.join(process.cwd(), "uploads")

const upload = multer({dest: directory})

const server = express()

// ** Middlewares **
server.disable("x-powered-by")
server.use(rateConfig)
server.use(upload.single("file"))
server.use(parser.urlencoded({extended: false}))
server.use(express.json()) // Server middleware
server.use(morgan("combined"))
// ** ~ Middlewares **

// ** Routers  **
server.use("/blog", blog)
server.use("/user", user)
server.use("/comment", comment)

// ** ~ Routers  **

server.listen(PORT, async () => {
    await createConnection()
    console.log(`Server is running: http://localhost:${PORT}`)
})

