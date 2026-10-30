import React, { useContext, useState } from 'react'
import { UserDataContext } from '../context/UserContext';
import axios from "axios"
import { IoArrowBackSharp } from "react-icons/io5";

import { useNavigate } from 'react-router-dom';


function Customize2() {

  const {userData,setuserData,backendImage,selectedImage,serverUrl} = useContext(UserDataContext)
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleUpdateAssistant = async () => {
    setLoading(true)
    try {
      let formData = new FormData()  
      formData.append("assistantName",assistantName)
      if(backendImage){
        formData.append("assistantImage",backendImage)
      }else{
        formData.append("imageUrl",selectedImage)
      }
      const result = await axios.post(`${serverUrl}/api/auth/update`,formData,{withCredentials:true})
      setLoading(false)
      console.log(result.data)
      setuserData(result.data)
      navigate("/")
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  return (
    <div className="w-full h-screen  bg-linear-to-b from-blue-900 to-black flex justify-center items-center flex-col
     relative">
      <IoArrowBackSharp className='text-white absolute top-[30px] left-[30px] text-3xl cursor-pointer' onClick={()=>navigate("/customize")}/>

       <h1 className="text-white text-center text-2xl font-semibold mb-6 ">Enter your <span className="text-blue-400">Assistant Name</span></h1>
        <input
          type="text"
          placeholder="eg. shifra"
          className="w-full max-w-[500px] border-2 border-white placeholder-gray-300 text-white outline-none rounded-full px-4 py-2"
          required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}
        />
        {assistantName && <button className="bg-white text-black font-semibold min-w-[300px] h-[45px] rounded-full text-lg cursor-pointer mt-6" disabled={loading} onClick={handleUpdateAssistant} >{!loading?"Finally create your Assistant":"Loading..."}</button>}
    </div>
  )
}

export default Customize2
