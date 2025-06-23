"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import {
  Box,
  Container,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
} from "@chakra-ui/react";
import Login from "@/components/Authentication/Login";
import Signup from "@/components/Authentication/Signup";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      router.push("/chatPage");
    }
  }, [router]);


  const navigateToPage = () => {
    router.push("/chatPage");
  };

  return (
    <div>
      <main className="">
        <Container maxW="xl" centerContent>
          <Box
            display="flex"
            justifyContent="center"
            bg={"white"}
            w="100%"
            m="40px 0 15px 0"
            borderRadius="15px"
            borderWidth="1px"
          >
            <Text fontSize="2xl" fontFamily="Work sans" color="black">
              Live Chat
            </Text>
          </Box>

          <Box bg="white" w="100%" borderRadius="20px" borderWidth="1px">
            <Tabs variant="soft-rounded" colorScheme="blue" isFitted>
              <TabList>
                <Tab >Login</Tab>
                <Tab>Signup</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <Signup />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Container>
      </main>
    </div>
  );
}
