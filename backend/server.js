import express, { response } from 'express'
import dotenv from 'dotenv'
dotenv.config()
import dns from 'dns'
import connectDb from './config/db.js'
import userRouter from './routes/user.routes.js'
import cookieParser from 'cookie-parser'
import cors from "cors"
import authRouter from './routes/auth.routes.js'
import geminiResponse from './gemini.js'
dns.setServers(['8.8.8.8', '1.1.1.1']) 


const app = express()
app.use(cors({
    origin:"https://virtual-sooty.vercel.app",
    credentials:true
}))
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())
app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)

app.get("/", async (req, res) => {
    try {
        const prompt = req.query.prompt;
        
        if (!prompt) {
            return res.status(400).json({ error: "Please provide a prompt parameter. E.g. ?prompt=hello" });
        }

        const data = await geminiResponse(prompt);
        res.json(data); // Will return clean JSON: { reply: "..." } or { error: "..." }
        
    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.listen(port,()=>{
    connectDb()
    console.log("server is running")
})