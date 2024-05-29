import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    // origin: process.env.CORS_ORIGIN,
    origin:'http://localhost:5173',
    credentials: true,
}))

// Adding middleware to express application for handling JSON requests
app.use(express.json({limit: "16kb"}))

// URL-encoded requests
app.use(express.urlencoded({extended:true, limit:"16kb"}))

// Serving static files
app.use(express.static("public"))

app.use(cookieParser())


// Import Routes
import router from "./routes/user.routes.js";
import Postrouter from "./routes/post.routes.js";
import Likerouter from "./routes/like.routes.js";
import CommentRouter from "./routes/comment.routes.js";
import Followrouter from "./routes/follow.routes.js";

// router declaration 
app.use("/api/v1/users", router)
app.use("/api/v1/post", Postrouter)
app.use("/api/v1/like", Likerouter)
app.use("/api/v1/comment", CommentRouter)
app.use("/api/v1/follow", Followrouter)


export {app}