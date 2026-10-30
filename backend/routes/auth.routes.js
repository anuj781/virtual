import express from "express"
import { askToAssistant, deleteHistory, getCurrentUSer, updateAssistant } from "../controllers/user.controllers.js"
import isAuth from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"



const authRouter = express.Router()


authRouter.get("/current",isAuth,getCurrentUSer)
authRouter.post("/update",isAuth,upload.single("assistantImage"),updateAssistant)
authRouter.post("/asktoassistant",isAuth,askToAssistant)
authRouter.delete(
  "/delete-history/:index",
  isAuth,
  deleteHistory
);

export default authRouter