import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()

// MiddleWares That Run In Middle Of Request ..

// You Can Set The Origin From Where Can Request Come
app.use(cors({origin: process.env.CORS_ORIGIN,Credential: true}))

// Set The Limit Of Json Data
app.use(express.json({ limit: "16kb" }))

// Allow Url To Encode space And Encode The Url
app.use(express.urlencoded({extended: true,limit: "16kb"}))

//To Define One Public Folder In Which All File Can Be Easily Access
app.use(express.static("public"))

// Cookie To Perform CURD Operation ON Cookie
app.use(cookieParser())

// Define All Router In App.js..
// Import Routers.................
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import likeRouter from "./routes/like..routes.js"
import commentRouter from "./routes/comment.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import tweetRouter from "./routes/tweet.routes.js"

app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/playlist",playlistRouter)
app.use("/api/v1/tweets",tweetRouter)



export { app }