import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
export const UserDataContext = createContext();
function UserContext({ children }) {
  const serverUrl = "https://virtual-6itc.onrender.com/";
  const [userData, setuserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/current`, {
        withCredentials: true,
      });
      setuserData(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getGeminiResponse = async (command) =>{
    try {
      const result = await axios.post(`${serverUrl}/api/auth/asktoassistant`,{command},{withCredentials:true})
      return result.data 
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    handleCurrentUser();
  }, []);
  const value = {
    serverUrl,
    userData,
    setuserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
  };
  return (
    <div>
      <UserDataContext.Provider value={value}>
        {children}
      </UserDataContext.Provider>
    </div>
  );
}

export default UserContext;
