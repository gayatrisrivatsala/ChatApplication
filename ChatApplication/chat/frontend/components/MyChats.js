"use client";
import { ChatState } from "@/app/ChatProvider";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, Button, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import ChatLoading from "./ChatLoading";
import React from "react";
import { getSender } from "./config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, chats, setChats, user } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    // Create a promise that resolves when the chats are fetched successfully
    const fetchPromise = new Promise(async (resolve, reject) => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(
          "http://localhost:5000/api/chat",
          config
        );
        setChats(data);
        resolve(); // Resolve when data is fetched
      } catch (error) {
        reject(error); // Reject if there's an error
      }
    });

    // Show toast with promise-based handling
    toast.promise(fetchPromise, {
      loading: { title: "Loading chats...", description: "Please wait" },
      success: {
        title: "Chats loaded successfully",
        description: "All chats are ready",
        duration: 2000,
      },
      error: {
        title: "Failed to load chats",
        description: "An unexpected error occurred",
        duration: 1000,
      },
    });
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(storedUser);

    if (storedUser?.token) {
      fetchChats();
    }
  }, [fetchAgain]);

  if (!loggedUser) {
    return <ChatLoading />; // Render a loading state until loggedUser is loaded
  }

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>My Chats</Text>
        <GroupChatModal>
          <Button display="flex" rightIcon={<AddIcon />} alignItems="center">
            Add Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#2b62ad" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupchat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
