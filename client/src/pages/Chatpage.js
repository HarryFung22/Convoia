import React from 'react';
import {
  Flex,
  Input,
  Stack,
  VStack,
  HStack,
  Divider,
  Text,
  Box,
  Heading,
  Button,
} from '@chakra-ui/react';

const ChatSidebar = () => {
  // Your chat list and search functionality logic here

  return (
    <VStack bg="white" w="25%" h="100vh" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.1)">
      <Box p="3">
        <Input placeholder="Search conversations" />
      </Box>
      {/* List of chats */}
      <Stack spacing="4" p="3" w="100%">
        {/* Map through user chats */}
        <HStack spacing="3" alignItems="center">
          <Box borderRadius="50%" bg="blue.500" w="12px" h="12px"></Box>
          <Text fontWeight="bold">Username</Text>
        </HStack>
        {/* Add more chat list items */}
      </Stack>
    </VStack>
  );
};

const Chat = () => {
  // Your chat functionality logic here

  return (
    <Box w="75%" h="100vh" bg="gray.100">
      {/* Chat area */}
      <Box bg="white" h="100%">
        {/* Chat messages */}
        <Stack spacing="6" p="6">
          {/* Chat message components */}
          <HStack>
            <Box borderRadius="50%" bg="blue.500" w="40px" h="40px"></Box>
            <Box bg="gray.200" w="70%" p="3" borderRadius="10px">
              <Text>Hello there!</Text>
            </Box>
          </HStack>
          {/* Add more chat messages */}
        </Stack>
        {/* Message input */}
        <Divider />
        <Box p="3">
          <Input placeholder="Type a message" />
        </Box>
      </Box>
    </Box>
  );
};

const ChatInterface = () => {
  const openSignUpModal = () => {
    // Your logic for opening sign-up modal
  };

  const openLoginModal = () => {
    // Your logic for opening login modal
  };

  return (
    <VStack spacing="0" h="100vh">
      <Flex
        p="4"
        borderBottom="1px solid #ccc"
        justify="space-between"
        w="100%"
      >
        <Flex align="center" spacing="8">
          <Heading as="h1" fontSize="xl" fontWeight="bold" mr="4">
            Convoia
          </Heading>
        </Flex>
        <Flex align="center" w="50%">
          {/* Empty spacer to center the global search */}
          <Box flex="1" />
          {/* Global search */}
          <Input placeholder="Global search" />
        </Flex>
      </Flex>
      <Flex w="100%" h="90%" bg="white">
        <ChatSidebar />
        <Chat />
      </Flex>
    </VStack>
  );
};

export default ChatInterface;