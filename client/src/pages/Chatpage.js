import React, { useState, useEffect } from 'react';
import {
  Flex,
  Input,
  VStack,
  Box,
  Heading,
  Image,
  Text,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  InputLeftElement
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faEyeSlash, faCircle } from '@fortawesome/free-solid-svg-icons';

const NewChatModal = ({ isOpen, onClose, setQuery, data, selectedUsers, setSelectedUsers }) => {

  const handleUserClick = (user) => {
    if (selectedUsers.some((selectedUser) => selectedUser._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const isSelected = (user) => {
    return selectedUsers.some((selectedUser) => selectedUser._id === user._id);
  };

  // const createGroupchat = async () => {
  //   var modified = [];
  //   selectedUsers.map((user) => modified.push(user._id));
  //   console.log(modified);
  //   const response = await fetch(`http://localhost:5000/api/chat/group`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({})
  //   })
  // }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalContent height="40vh">
        <ModalHeader>New Chat</ModalHeader>
        <ModalCloseButton color="black" _hover={{ color: 'gray.500' }} />
        <ModalBody overflowY="auto">
          <Box position="sticky" top="0" bg="white" p="3" zIndex="1">
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<FontAwesomeIcon icon={faSearch} />}
                  color="gray.500"
                />
                <Input placeholder="Search" onChange={(e) => setQuery(e.target.value)} />
              </InputGroup>
            </FormControl>
          </Box>
          <Box mt="3">
            {data.map((user) => (
              <Box
                key={user._id}
                p="3"
                cursor="pointer"
                _hover={{ bg: 'gray.100' }}
                onClick={() => handleUserClick(user)}
                w="100%"
                position="relative"
              >
                 <Flex align="center" justifyContent="flex-start">
                  <Image src={user.picture} alt={user.name} w="30px" h="30px" borderRadius="50%" mr="2" />
                  <Flex flexDirection="column">
                    <Text>{user.name}</Text>
                    <Text fontSize="sm" color="gray.500">{user.email}</Text>
                  </Flex>
                  <Box position="absolute" right="8px" top="50%" transform="translateY(-50%)">
                    <FontAwesomeIcon icon={faCircle} color={isSelected(user) ? '#ADD8E6' : 'gray'} />
                  </Box>
                </Flex>
              </Box>
            ))}
             {selectedUsers.length > 0 && (
                <Box mt="3">
                  {selectedUsers.map((user) => (
                    <Box
                      key={user._id}
                      p="2"
                      bg="gray.100"
                      borderRadius="md"
                      mr="2"
                      mb="2"
                      display="inline-block"
                      onClick={() => handleUserClick(user)}
                      cursor="pointer"
                    >
                      <Text>{user.name}</Text>
                    </Box>
                  ))}
                </Box>
              )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="blue" variant="ghost" onClick={() => console.log('bruh')}>
            Sign Up
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};


const ChatSidebar = ({ setQuery, data }) => {
  return (
    <VStack bg="white" w="15%" h="100vh" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.1)">
      <Box p="3">
        <Flex align="center">
          <FormControl>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<FontAwesomeIcon icon={faSearch} />}
                color="gray.500"
              />
              <Input placeholder="Search" onChange={(e) => setQuery(e.target.value)}/>
            </InputGroup>
          </FormControl>
        </Flex>
      </Box>
      {data.map((user) => {
        const shouldHideOverflow = user.name.length > 10;
        return (
          <Box
            key={user._id}
            p="3"
            cursor="pointer"
            _hover={{ bg: 'gray.100' }}
            onClick={() => console.log(user.name)}
            w="100%"
          >
            <Flex align="center" justifyContent="center">
              <Image src={user.picture} alt={user.name} w="30px" h="30px" borderRadius="50%" mr="2" />
              <Text
                w="80px"
                overflow={shouldHideOverflow ? 'hidden' : 'visible'}
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {user.name}
              </Text>
            </Flex>
          </Box>
        );
      })}
    </VStack>
  );
};

const Chat = () => {
  return <Box w="85%" h="100vh" bg="gray.100"></Box>;
};

const ChatInterface = () => {
  const token = JSON.parse(localStorage.getItem('user')).token;

  //sidebar
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);

  //new chat button
  const [selectQuery, setSelectQuery] = useState('');
  const [selectData, setSelectData] = useState([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  //new chat search query
  const fetchQuery = async () => {
    const response = await fetch(`http://localhost:5000/api/user?search=${selectQuery}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();
    if (response.ok) {
      setSelectData(json);
    }
  };

  useEffect(() => {
    fetchQuery();
  }, [selectQuery]);

  return (
    <VStack spacing="0" h="100vh">
      <Flex p="4" borderBottom="1px solid #ccc" justify="space-between" w="100%" align="center" px="6">
        <Flex align="center" spacing="8">
          <Heading as="h1" fontSize="xl" fontWeight="bold" mr="4">
            Convoia
          </Heading>
        </Flex>
        <Button onClick={() => setShowNewChatModal(true)}>New Chat</Button>
        <NewChatModal 
          isOpen={showNewChatModal} 
          onClose={() => {
            setShowNewChatModal(false);
            setSelectedUsers([]);
          }}
          setQuery={setSelectQuery}
          data={selectData} 
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
        />
      </Flex>
      <Flex w="100%" h="90%" bg="white">
        <ChatSidebar setQuery={setQuery} data={data} />
        <Chat />
      </Flex>
    </VStack>
  );
};

export default ChatInterface;