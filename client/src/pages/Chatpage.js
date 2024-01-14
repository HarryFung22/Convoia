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
  InputLeftElement,
  IconButton, 
  Menu, 
  MenuButton,
  MenuList, 
  MenuItem,
  Badge
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faEyeSlash, faCircle, faPaperPlane, faUser, faBell } from '@fortawesome/free-solid-svg-icons';
import io from "socket.io-client";

const socket = io('http://localhost:5000', {
  cors: {
    origin: 'http://localhost:3000', 
  },
});


const NewChatModal = ({ token, isOpen, onClose, setQuery, data, selectedUsers, setSelectedUsers, setChats }) => {

  const [name, setName] = useState("");

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

  const createGroupchat = async () => {
    var modified = [];
    selectedUsers.map((user) => modified.push(user._id));
    modified= JSON.stringify(modified);

    try{
      const response = await fetch(`http://localhost:5000/api/chat/group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({users: modified, name: name})
      })
      
      if(response.ok){
        const response = await fetch('http://localhost:5000/api/chat', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        const json = await response.json();
        if(response.ok) setChats(json)
        onClose();
      } 

    }catch(error){
      console.log(error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
      <ModalContent height="40vh">
        <ModalHeader>New Chat</ModalHeader>
        <ModalCloseButton color="black" _hover={{ color: 'gray.500' }} />
        <ModalBody overflowY="auto">
          <Box position="sticky" top="0" bg="white" p="3" zIndex="1">
            <FormLabel>Name</FormLabel>
              <Input
                id='name'
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                mb="4"
              />
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
          <Button colorScheme="blue" variant="ghost" onClick={createGroupchat}>
            Create Group Chat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};


const ChatSidebar = ({ chats, setChats, token, clickRef, setClickRef }) => {
  const [query, setQuery] = useState('');

  return (
    <VStack bg="white" w="15%" h="94.4vh" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.1)">
      <Box p="3">
        <Flex align="center">
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
        </Flex>
      </Box>
      {chats.map((chat) => {
        const shouldHideOverflow = chat.chatName.length > 30;
        return (
          <Box
            key={chat._id}
            p="3"
            cursor="pointer"
            _hover={{ bg: 'gray.100' }}
            onClick={() => {
              setClickRef(chat);
              socket.emit("join chat", chat._id);
            }}
            w="100%"
            overflow="hidden"
          >
            <Flex align="flex-start" justifyContent="flex-start" flexDirection="column">
              <Text
                w="80px"
                overflow={shouldHideOverflow ? 'hidden' : 'visible'}
                textOverflow="ellipsis"
                color="gray.800"
                whiteSpace="nowrap"
              >
                {chat.chatName}
              </Text>
              {chat.latestMessage && (
                <Text as={clickRef._id === chat._id && 'b'} fontSize="sm" textAlign="left">
                  {chat.latestMessage.sender.name}: {chat.latestMessage.content}
                </Text>
              )}
            </Flex>
          </Box>
        );
      })}
    </VStack>
  );
};


const Chat = ({clickRef, token, user, messages, setMessages, refreshChats}) => {
  const [text, setText] = useState("");

  const handleReq = async () => {
    const response = await fetch('http://localhost:5000/api/message/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({content: text, chatID: clickRef._id})
    })

    if (response.ok){
      const json = await response.json();
      setMessages(prevMessages => [...prevMessages, json])
      setText("");
      socket.emit("new message", json);
      refreshChats();
    }
  }

  const fetchMessages = async () => {
    try{
      const response = await fetch(`http://localhost:5000/api/message/${clickRef._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if(response.ok){
        const json = await response.json();
        setMessages(json);
      }

      }catch(error){
        console.log(error)
      }
  }

  useEffect(() => {
    fetchMessages();
  }, [clickRef])

  const renderMessage = (message) => {
    const isUser = message.sender._id === user._id;
    const alignment = isUser ? 'flex-end' : 'flex-start';
  
    return (
      <Flex key={message._id} justify={alignment} mb="2" alignItems="flex-start">
        {!isUser && (
          <Box mt="auto" mb="auto" mr="2">
            <FontAwesomeIcon icon={faUser} />
          </Box>
        )}
        <Box w="100%">
          <Flex align="center" justify={isUser ? 'flex-end' : 'flex-start'}>
            <Box
              p="3"
              bg={isUser ? 'blue.200' : 'gray.200'}
              color={isUser ? 'white' : 'black'}
              borderRadius="md"
              maxW="70%"
              mb="2"
            >
              <Box textAlign={isUser ? 'right' : 'left'} mb="2">
                <Text fontSize="sm" fontWeight="bold">{isUser ? 'You' : message.sender.name}</Text>
                <Text fontSize="sm" color="gray.500">{!isUser && message.sender.email}</Text>
              </Box>
              {message.content}
            </Box>
          </Flex>
        </Box>
        {isUser && (
          <Box mt="auto" mb="auto" ml="2">
            <FontAwesomeIcon icon={faUser} />
          </Box>
        )}
      </Flex>
    );
  };

  return (
    <Box w="85%" h="94.4vh" bg="gray.100" p="4" display="flex" flexDirection="column">
      <Box bg="white" p="2" mb="2">
        <Text fontSize="xl" fontWeight="bold">{clickRef && clickRef.chatName}</Text>
      </Box>
      <Box flex="1" overflowY="auto" pr="8">
        {messages.length > 0 && messages.map((message) => renderMessage(message))}
      </Box>
      <Flex align="center">
        <Input placeholder="Type your message..." flex="1" mr="2" value={text} onChange={(e) => setText(e.target.value)} />
        <IconButton
          aria-label="Send message"
          icon={<FontAwesomeIcon icon={faPaperPlane} />}
          colorScheme="blue"
          onClick={handleReq}
        />
      </Flex>
    </Box>
  );
};


const ChatInterface = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [clickRef, setClickRef] = useState([]);

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
        Authorization: `Bearer ${user.token}`,
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

  //sidebar
  const [chats, setChats] = useState([]);

  //mainchat
  const [messages, setMessages] = useState("")

  const chatsFetch = async () => {
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    })

    if (response.ok){
      const json = await response.json();
      setChats(json);
      setClickRef(json[0]);
    }
  }

  useEffect(() => chatsFetch, [])

  //socket connection
  socket.emit("setup", user);
  socket.on("connected", () => chatsFetch)

  const refreshChats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) setChats(json);
    } catch (error) {
      console.log(error);
    }
  }

  const [notifications, setNotifications] = useState([])
  
  useEffect(() => {
    const handleNewMessage = (newMessageReceived) => {
      setNotifications((prev) => [...prev, newMessageReceived])
      
      const messageExists = messages && messages.some((message) => message._id === newMessageReceived._id);
      if (!messageExists) setMessages((prev) => [...prev, newMessageReceived]);
      refreshChats();
    };
  
    socket.on("message received", handleNewMessage);
  
    return () => {
      socket.off("message received", handleNewMessage);
    };
  }, [messages])

  return (
    <VStack spacing="0" h="100vh">
      <Flex p="4" borderBottom="1px solid #ccc" justify="space-between" w="100%" align="center" px="6">
        <Flex align="center" spacing="8">
          <Heading as="h1" fontSize="xl" fontWeight="bold" mr="4">
            Convoia
          </Heading>
        </Flex>
        <Flex ml="auto" align="center">
          <Menu>
            <MenuButton as={Button} variant="ghost" position="relative">
              <FontAwesomeIcon icon={faBell} size="lg" />
              {notifications.length > 0 && (
                <Badge
                  position="absolute"
                  top="-1"
                  right="-1"
                  colorScheme="red"
                >
                  {notifications.length}
                </Badge>
              )}
            </MenuButton>
            {notifications.length > 0 && (
              <MenuList>
                {notifications.map((notification, i) => {
                  const sentAtTime = new Date(notification.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                  return (
                    <MenuItem key={i}>
                    <Box>
                      <Text fontWeight="bold">{notification.chat.chatName}</Text>
                      <Text fontSize="sm" color="gray.500">{`Sent by ${notification.sender.name} at ${sentAtTime}`}</Text>
                      <Text>{notification.content}</Text>
                    </Box>
                  </MenuItem>
                  )
                })}
                <MenuItem onClick={() => setNotifications([])}>Clear Notifications</MenuItem>
              </MenuList>
            )}
          </Menu>
          <Button onClick={() => setShowNewChatModal(true)} ml="4">New Chat</Button>
        </Flex>
        <NewChatModal 
          token={user.token}
          isOpen={showNewChatModal} 
          onClose={() => {
            setShowNewChatModal(false);
            setSelectedUsers([]);
          }}
          setQuery={setSelectQuery}
          data={selectData} 
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          setChats={setChats}
        />
      </Flex>
      <Flex w="100%" h="90%" bg="white">
        <ChatSidebar chats={chats} setChats={setChats} token={user.token} clickRef={clickRef} setClickRef={setClickRef}/>
        <Chat clickRef={clickRef} token={user.token} user={user} messages={messages} setMessages={setMessages} refreshChats={refreshChats}/>
      </Flex>
    </VStack>
  );
};

export default ChatInterface;