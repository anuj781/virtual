import React, { useContext, useRef, useState } from "react";
import { MdAddPhotoAlternate } from "react-icons/md";
import { IoArrowBackSharp } from "react-icons/io5";


import Cards from "../components/Cards";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function Customize() {
   const {serverUrl,
    userData,
    setuserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,}=useContext(UserDataContext)
    const navigate = useNavigate();
    const inputImage = useRef();
    const handleImage= (e) =>{
const file = e.target.files[0]
setBackendImage(file)
setFrontendImage(URL.createObjectURL(file))
    }

  return (
    <div className="w-full h-screen  bg-linear-to-b from-blue-900 to-black flex justify-center items-center flex-col">
            <IoArrowBackSharp className='text-white absolute top-[30px] left-[30px] text-3xl cursor-pointer' onClick={()=>navigate("/")}/>
      
        <h1 className="text-white text-center text-2xl font-semibold mb-6 ">Select your <span className="text-blue-400">Assistant Image</span></h1>
      <div className="w-[50%] max-w-[60%] flex justify-center items-center flex-wrap  gap-[25px]">
        <Cards image={image1} />
        <Cards image={image2} />
        <Cards image={image3} />
        <Cards image={image4} />
        <Cards image={image5} />
        <Cards image={image6} />
        <Cards image={image7} />
            <div className={`w-[50px] h-[100px] sm:w-[70px] sm:h-[150px]  lg:w-[100px] lg:h-[200px] bg-[#020235] border-2 border-[#0000ff18] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex justify-center items-center ${selectedImage=="input"? "border-4 border-white shadow-2xl shadow-blue-950":null}`} onClick={()=>{inputImage.current.click()
              setSelectedImage("input")
            }}>
      {!frontendImage && <MdAddPhotoAlternate className="text-white text-3xl"/>}
      {frontendImage && <img src={frontendImage} className='h-full object-cover' /> }
      
    </div>
    <input type="file" accept="image/*" ref={inputImage} hidden  onChange={handleImage}/>
      </div>
    {selectedImage &&   <button className="bg-white text-black font-semibold min-w-[120px] h-[45px] rounded-full text-lg cursor-pointer mt-6" onClick={()=>navigate("/customize2")}>Next</button>}
    </div>
  );
}

export default Customize;
