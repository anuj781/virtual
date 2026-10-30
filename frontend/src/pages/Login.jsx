import React, { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";


function Login() {
  const [showPassword, setshowPassword] = useState(false);
  const {serverUrl,userData,setuserData} = useContext(UserDataContext)
  const navigate = useNavigate();

     const [email, setemail] = useState("");
     const [password, setpassword] = useState("");
     const [err, seterr] = useState("");
     const [loading, setloading] = useState(false);

     const handleLogIn = async (e) =>{
      e.preventDefault();
      seterr("");
       setloading(true);
try{
let result = await axios.post(`${serverUrl}/api/user/login`,{
  email,password
},{withCredentials:true})
setuserData(result.data)
setloading(false);
navigate("/")
}catch(error){
console.log(error)
setuserData(null)
setloading(false);
seterr(error.response.data.message)
}
     }
  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form className="w-[90%] h-[500px] max-w-[450px] bg-[#0000003d] flex flex-col justify-center items-center gap-[25px] backdrop-blur shadow-lg shadow-black rounded-md px-[20px]" onSubmit={handleLogIn}>
        <h1 className="text-white text-[30px] py-6 font-semibold ">
          Login to <span className="text-blue-700">Virtual Assistant</span>
        </h1>
        <input
          type="text"
          placeholder="Enter Email"
          className="w-full border-2 border-white placeholder-gray-300 text-white outline-none rounded-full px-4 py-2"
          required onChange={(e)=>setemail(e.target.value)} value={email}
        />
          
          <div className="w-full relative">
            <input
          type={showPassword?"text":"password"}
          placeholder="Enter Password"
          className="w-full border-2 border-white placeholder-gray-300 text-white outline-none rounded-full px-4 py-2"
          required onChange={(e)=>setpassword(e.target.value)} value={password}
        />
        {!showPassword&&
         <IoEye className="text-white absolute top-[13px] right-[30px] text-xl cursor-pointer" onClick={()=>setshowPassword(true)}/>}
          {showPassword&&
         <IoEyeOff className="text-white absolute top-[13px] right-[30px] text-xl cursor-pointer" onClick={()=>setshowPassword(false)}/>}
          </div>
         
{err.length>0 && <p className="text-red-500 text-lg">
  *{err}
  </p>}

        <button className="bg-white text-black font-semibold min-w-[120px] h-[45px] rounded-full text-lg cursor-pointer" disabled={loading} >{loading?"Loading...":"Log In"}</button>
        <p className="text-white text-xl">want to create a new account? <span className="text-blue-300 cursor-pointer" onClick={()=>navigate("/signup")}>Sign up</span></p>
      </form>
    </div>
  );
}

export default Login;
