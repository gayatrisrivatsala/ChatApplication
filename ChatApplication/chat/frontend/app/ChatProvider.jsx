"use client";

import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
const ChatContext = createContext();


export function ChatProvider({ children }) {
  const [user, setUser] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats]= useState([])
  const [notification, setNotification] = useState([]);
  
  const router = useRouter();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if(userInfo){
      router.push("/");
    }
  }, [router] );

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const ChatState = ()=>{
  return useContext(ChatContext);
}


export default ChatProvider;