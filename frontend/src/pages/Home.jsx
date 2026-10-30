import React, { useEffect, useRef, useState } from 'react'
import { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
import { RiMenuLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { RiFunctionAiFill } from "react-icons/ri";
import { Trash2 } from "lucide-react";





function Home() {
  const {userData,serverUrl,setuserData,getGeminiResponse}=useContext(UserDataContext) 
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const isSpeakingRef =useRef(false)
 const recognitionRef = useRef(null)
 const [ham, setHam] = useState(false);
 const [settings, setSettings] = useState(false);
 const isRecognizingRef = useRef(false)
 const synth = window.speechSynthesis

  const handleLogout = async ()=>{
     try{
       const result= await axios.get(`${serverUrl}/api/user/logout`,{withCredentials:true})
       setuserData(null)
       navigate("/login")
     }catch(error){
      setuserData(null)
       console.log(error)
     }
  }

  
const handleDeleteHistory = async (index) => {
  try {
    const result = await axios.delete(
      `${serverUrl}/api/auth/delete-history/${index}`,
      {
        withCredentials: true
      }
    );

    if (result.data.success) {
      // Update React Context immediately
      setuserData(prev => ({
        ...prev,
        history: result.data.history
      }));

      console.log(result.data.message);
    }

  } catch (error) {
    console.error(
      "Unable to delete history:",
      error.response?.data || error.message
    );
  }
};


  const startRecognition = () =>{
    try {
      recognitionRef.current?.start();
      setListening(true);
    } catch (error) {
      if(!error.message.includes("start")){
        console.error("Recognition error:",error);
      }
    }
  }

  const speak =(text)=>{
    const utterance = new SpeechSynthesisUtterance(text)
utterance.lang = 'hi-IN';
const voices = window.speechSynthesis.getVoices()
const hindiVoice = voices.find(v=> v.lang === 'hi-IN');
if(hindiVoice){
  utterance.voice = hindiVoice;
}




    isSpeakingRef.current=true
    utterance.onend=()=>{
      setAiText("")
      isSpeakingRef.current=false
      startRecognition()
    }
    synth.speak(utterance)
  }

  const handleCommand =(data)=>{
    
    const {type,userInput,response}= data
    speak(response);

    if(type === 'google_search'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`,'_blank');
    }
    if(type === 'calculator_open'){
      
      window.open(`https://www.google.com/search?q=calculator`,'_blank');
    }
     if(type === 'instagram_open'){
      
      window.open(`https://www.instagram.com/`,'_blank');
    }
     if(type === 'facebook_open'){
      
      window.open(`https://www.facebook.com/`,'_blank');
    }
     if(type === 'weather_show'){
      
      window.open(`https://www.google.com/search?q=weather`,'_blank');
    }
    if(type === 'youtube_search' || type === 'youtube_play'){
       const query = encodeURIComponent(userInput);
       window.open(`https://www.youtube.com/results?search_query=${query}`,'_blank');

    }
  }

  useEffect(() => {
    
  const SpeechRecognition = window.SpeechRecognition || window.webkit.SpeechRecognition

  const recognition = new SpeechRecognition()
  recognition.continuous=true,
   recognition.lang='en-US'

   recognitionRef.current= recognition



   const safeRecognition =()=>{
    if(!isSpeakingRef.current && !isRecognizingRef.current){
      try {
        recognition.start() 
        console.log("Recognition requested to start")
      } catch (err) {
        if(err.name !== "InvalidStateError"){
          console.log("Start error:",err)
        }
      }
      
    }
   }

   recognition.onstart = () =>{
    console.log("Recognition started");
    isRecognizingRef.current = true;
    setListening(true);
   }

    recognition.onend = () =>{
    console.log("Recognition ended");
    isRecognizingRef.current = false;
    setListening(false);
    if(!isSpeakingRef.current){
      setTimeout(()=>{
        safeRecognition()
      },1000);
    }
   };


   recognition.onerror =(event)=>{
    console.warn("Recognition error:",event.error);
    isRecognizingRef.current = false;
    setListening(false);
    if(event.error !== "aborted" && !isSpeakingRef.current){
      setTimeout(()=>{
        safeRecognition();
      },1000)
    }
   };



   recognition.onresult= async(e)=>{
    const transcript = e.results[e.results.length-1][0].transcript.trim()
    console.log(transcript)
    if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
      setAiText("")
      setUserText(transcript)
      recognition.stop()
      isRecognizingRef.current=false
      setListening(false)
  
    const data = await getGeminiResponse(transcript);

if (!data || !data.success) {
  console.error("Assistant request failed");
  return;
}

// Update history immediately
setuserData(prev => ({
  ...prev,
  history: data.history
}));

handleCommand(data);

setAiText(data.response);
setUserText("");
    }
   }

  //  recognition.start()
  const fallback = setInterval(() => {
    if(!isSpeakingRef.current && !isRecognizingRef.current){
      safeRecognition()
    }

  }, 10000);
  safeRecognition()
  return ()=> {
    recognition.stop()
    setListening(false)
    isRecognizingRef.current=false
    clearInterval(fallback)
  }
  }, []);

  return (
    <div className="w-full h-screen  bg-linear-to-b from-blue-900 to-black flex justify-center items-center flex-col gap-[15px]">
      <RiMenuLine  className='lg:hidden text-white w-[25px] h-[25px] absolute top-[20px] right-[20px]' onClick={()=>setHam(true)}/>

      <div
  className={`fixed inset-0 w-full h-dvh overflow-hidden lg:hidden
    bg-[#00000025] backdrop-blur-lg p-[20px]
    flex flex-col gap-[20px] items-start
    ${ham ? "translate-x-0" : "translate-x-full"}
    transition-transform duration-300`}
>
  <RxCross2
    className="text-white w-[25px] h-[25px] absolute top-[20px] right-[20px] cursor-pointer"
    onClick={() => setHam(false)}
  />

  <button
    className="bg-white text-black font-semibold min-w-[120px] h-[45px] shrink-0 rounded-full text-lg cursor-pointer"
    onClick={handleLogout}
  >
    Log Out
  </button>

  <button
    className="bg-white text-black font-semibold min-w-[120px] h-[45px] shrink-0 rounded-full text-lg cursor-pointer px-3"
    onClick={() => navigate("/customize")}
  >
    Customize your Assistant
  </button>

  <div className="w-full h-[2px] shrink-0 bg-gray-400" />

  <h1 className="text-white font-semibold text-[19px] shrink-0">
    History
  </h1>

  <div className="w-full flex-1 min-h-0 overflow-y-auto flex flex-col gap-2">
 
{userData?.history?.map((his, index) => (
  <div
    key={index}
    className="w-full flex items-center justify-between gap-3 
    text-gray-200 text-lg p-2 rounded-lg 
    hover:bg-white/10 transition"
  >
    <span className="flex-1 break-words min-w-0">
      {his}
    </span>

    <button
      onClick={() => handleDeleteHistory(index)}
      className="text-red-400 hover:text-red-600 
      hover:bg-red-500/10 p-2 rounded-lg 
      transition shrink-0 z-50"
      title="Delete history"
    >
      <Trash2 size={18} />
    </button>
  </div>
))}

  </div>
</div>
      <RiFunctionAiFill  className='hidden lg:block text-white w-[25px] h-[25px] fixed top-[20px] left-[20px] z-50' onClick={()=> setSettings((prev) => !prev)}/>
      <div className={`fixed top-0 left-0 h-full hidden lg:flex flex-col items-start gap-[20px] p-[15px] pt-[60px] bg-[#00000041] ${settings?"translate-x-0":"-translate-x-full"} transition-transform `}>

<button className="bg-white text-black font-semibold min-w-[120px] h-[45px] rounded-full text-lg cursor-pointer" onClick={handleLogout}>Log Out</button>
        <button className="bg-white text-black font-semibold min-w-[120px] h-[45px] rounded-full text-lg cursor-pointer px-3" onClick={()=>navigate("/customize")}>Customize your Assistant</button>
        <div className='w-full h-[2px] bg-gray-400'></div>
<h1 className='text-white font-semibold text-[19px]'>History</h1>
<div className='w-full h-[60%] overflow-auto flex flex-col'>
 
{userData?.history?.map((his, index) => (
  <div
    key={index}
    className="w-full flex items-center justify-between gap-3 
    text-gray-200 text-lg p-2 rounded-lg 
    hover:bg-white/10 transition"
  >
    <span className="flex-1 break-words min-w-0">
      {his}
    </span>

    <button
      onClick={() => handleDeleteHistory(index)}
      className="text-red-400 hover:text-red-600 
      hover:bg-red-500/10 p-2 rounded-lg 
      transition shrink-0 z-50"
      title="Delete history"
    >
      <Trash2 size={18} />
    </button>
  </div>
))}

</div>
      </div>

 

       
      <div className='w-[150px] h-[300px] flex justify-center items-center'>
      <img src={userData?.assistantImage} alt=""  className='h-full w-full  object-cover rounded-4xl'/>

      </div>
   
      <h1 className='text-white text-2xl font-semibold'>I'm {userData?.assistantName}</h1>
      {!aiText && <img src={userImg} alt='' className='w-[120px]'/>}
      {aiText && <img src={aiImg} alt='' className='w-[120px]'/>}
      <h1 className='text-white text-xl font-semibold'>{userText?userText:aiText?aiText:null}</h1>
    </div>
  )
}

export default Home
