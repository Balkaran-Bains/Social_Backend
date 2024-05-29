// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// const app = express()

// app.use(cors({
//     // origin: process.env.CORS_ORIGIN,
//     origin:'http://localhost:5173',
//     credentials: true,
// }))

// // Adding middleware to express application for handling JSON requests
// app.use(express.json({limit: "16kb"}))

// // URL-encoded requests
// app.use(express.urlencoded({extended:true, limit:"16kb"}))

// // Serving static files
// app.use(express.static("public"))

// app.use(cookieParser())


// // Import Routes
// import router from "./routes/user.routes.js";
// import Postrouter from "./routes/post.routes.js";
// import Likerouter from "./routes/like.routes.js";
// import CommentRouter from "./routes/comment.routes.js";
// import Followrouter from "./routes/follow.routes.js";

// // router declaration 
// app.use("/api/v1/users", router)
// app.use("/api/v1/post", Postrouter)
// app.use("/api/v1/like", Likerouter)
// app.use("/api/v1/comment", CommentRouter)
// app.use("/api/v1/follow", Followrouter)


// export {app}
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

const enforceHTTPS = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.hostname, req.url].join(''));
  }
  return next();
};

// Only use this middleware in production
if (process.env.NODE_ENV === 'production') {
  app.use(enforceHTTPS);
}
// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://social-frontend-ochre.vercel.app'
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Adding middleware to express application for handling JSON requests
app.use(express.json({ limit: '16kb' }));

// URL-encoded requests
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Serving static files
app.use(express.static('public'));

app.use(cookieParser());

// Import Routes
import router from './routes/user.routes.js';
import Postrouter from './routes/post.routes.js';
import Likerouter from './routes/like.routes.js';
import CommentRouter from './routes/comment.routes.js';
import Followrouter from './routes/follow.routes.js';

// Router declaration 
app.use('/api/v1/users', router);
app.use('/api/v1/post', Postrouter);
app.use('/api/v1/like', Likerouter);
app.use('/api/v1/comment', CommentRouter);
app.use('/api/v1/follow', Followrouter);

export { app };
