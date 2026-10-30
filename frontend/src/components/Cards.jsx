import React, { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

function Cards({ image }) {
  const {
    serverUrl,
    userData,
    setuserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(UserDataContext);
  return (
    <div
      className={`w-[50px] h-[100px] sm:w-[70px] sm:h-[150px]  lg:w-[100px] lg:h-[200px] bg-[#020235] border-2 border-[#0000ff18] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${selectedImage==image? "border-4 border-white shadow-2xl shadow-blue-950":null}`}
      onClick={() => {
        setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
      }}
    >
      <img src={image} className="h-full object-cover" />
    </div>
  );
}

export default Cards;
