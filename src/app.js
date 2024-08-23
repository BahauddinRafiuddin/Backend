import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()

// MiddleWares That Run In Middle Of Request ..

// You Can Set The Origin From Where Can Request Come
app.use(cors({origin: process.env.CORS_ORIGIN,Credential: true}))

// Set The Limit Of Json Data
app.use(express.json({ limit: "1bkb" }))

// Allow Url To Encode space And Encode The Url
app.use(express.urlencoded({extended: true,limit: "16kb"}))

//To Define One Public Folder In Which All File Can Be Easily Access
app.use(express.static("public"))

// Cookie To Perform CURD Operation ON Cookie
app.use(cookieParser())




export { app }