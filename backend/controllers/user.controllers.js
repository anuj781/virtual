import { response } from "express"
import geminiResponse from "../gemini.js"
import User from "../models/user.model.js"
import moment from "moment";
export const getCurrentUSer = async (req,res) =>{
    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({message:"get current user error"})
    }
}

export const updateAssistant = async (req,res) =>{
    try {
        const {assistantName,imageUrl} = req.body
        let assistantImage;
        if(req.file){
            assistantImage=await uploadOnCloudinary(req.file.path)
        }else{
            assistantImage=imageUrl
        }
        const user = await User.findByIdAndUpdate(req.userId,{
            assistantName,assistantImage
        },{new:true}).select("-password")
        return res.status(200).json(user)
        
    } catch (error) {
        return res.status(400).json({message:"update assistant error"})
    
    }
}


export const askToAssistant = async (req, res) => {
  try {
    // 1. Get command from request body
    const { command } = req.body;

    if (
      typeof command !== "string" ||
      !command.trim()
    ) {
      return res.status(400).json({
        success: false,
        response: "Please provide a valid command.",
      });
    }

    // 2. Find authenticated user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        response: "User not found.",
      });
    }

    // 3. Get user and assistant details
    const userName = user.name;
    const assistantName = user.assistantName;

    if (!assistantName || !userName) {
      return res.status(400).json({
        success: false,
        response: "Please configure your assistant profile.",
      });
    }

    // 4. Get parsed JSON object from Gemini
    const result = await geminiResponse(
      command.trim(),
      assistantName,
      userName
    );

    if (!result || result.error) {
      return res.status(502).json({
        success: false,
        response: "Sorry, I couldn't process your request.",
      });
    }

    const { type, userInput, response } = result;

    // 5. Handle different intents
    let finalResponse = response;

    switch (type) {
      case "get_date":
        finalResponse = `Current date is ${moment().format("YYYY-MM-DD")}`;
        break;

      case "get_time":
        finalResponse = `Current time is ${moment().format("hh:mm A")}`;
        break;

      case "get_day":
        finalResponse = `Today is ${moment().format("dddd")}`;
        break;

      case "get_month":
        finalResponse = `Current month is ${moment().format("MMMM")}`;
        break;

      case "general":
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
        break;

      default:
        return res.status(400).json({
          success: false,
          response: "I didn't understand that command.",
        });
    }

    // 6. Update user history
    user.history.push(command.trim());

    // 7. Save updated history in MongoDB
    await user.save();

    // 8. Send updated history to frontend
    return res.status(200).json({
      success: true,
      type,
      userInput,
      response: finalResponse,
      history: user.history,
    });

  } catch (error) {
    console.error("Ask assistant controller error:", error);

    return res.status(500).json({
      success: false,
      response: "An error occurred while processing your request.",
    });
  }
};



export const deleteHistory = async (req, res) => {
  try {
    const { index } = req.params;

    const historyIndex = Number(index);

    // Validate index
    if (
      !Number.isInteger(historyIndex) ||
      historyIndex < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid history index."
      });
    }

    // Find authenticated user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    // Check whether history exists
    if (historyIndex >= user.history.length) {
      return res.status(404).json({
        success: false,
        message: "History not found."
      });
    }

    // Delete only selected history
    user.history.splice(historyIndex, 1);

    // Save updated history
    await user.save();

    return res.status(200).json({
      success: true,
      message: "History deleted successfully.",
      history: user.history
    });

  } catch (error) {
    console.error("Delete history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete history."
    });
  }
};


