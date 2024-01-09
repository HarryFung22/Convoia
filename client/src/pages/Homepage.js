import { Button, Flex, Heading, Link, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text, FormControl, FormLabel, Input, InputRightElement, InputGroup } from '@chakra-ui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();

  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const openSignUpModal = () => setSignUpModalOpen(true);
  const closeSignUpModal = () => setSignUpModalOpen(false);

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    try{
      const response = await fetch('http://localhost:5000/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: name, email: email, password: password})
      })
      
      const json = await response.json();
      if(response.ok){
        localStorage.setItem('user', JSON.stringify(json));
        navigate('/chats')
      }else{
        //error handling
        console.log(json.message)
      }

    }catch(error){
      console.log(error)
    }
  }

  const handleLogin = async () => {
    try{
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email, password: password})
      })

      const json = await response.json();
      if(response.ok){
        localStorage.setItem('user', JSON.stringify(json));
        navigate('/chats')
      }else{
        //error handling
        console.log(json.message)
      }

    }catch(error){
      console.log(error)
    }
  }

  return (
    <Flex direction="column" minH="100vh">
      <Flex p="4" borderBottom="1px solid #ccc" justify="space-between" align="center">
        <Flex align="center" spacing="8">
          <Heading as="h1" fontSize="xl" fontWeight="bold" mr="4">
            Convoia
          </Heading>
        </Flex>
        <Flex align="center" spacing="4">
          <Button colorScheme="blue" variant="solid" onClick={openSignUpModal} mr="2">
            Sign Up
          </Button>
          <Button colorScheme="blue" variant="outline" onClick={openLoginModal}>
            Log In
          </Button>
        </Flex>
      </Flex>

      <Flex flex="1" justify="center" align="center">
        <div className="text-center">
          <Heading as="h1" fontSize="4xl" fontWeight="bold" mb="4">
            Stay Connected, Explore Conversations, and Discover Real-Time Chats Around You!
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Join Convoia today.
          </Text>
          <Button
            colorScheme="blue"
            variant="solid"
            px="6"
            py="3"
            mt="4"
            borderRadius="full"
            fontWeight="semibold"
            _hover={{ bg: 'blue.600' }}
            onClick={openSignUpModal}
          >
            Sign Up
          </Button>
          <Text mt="4" fontSize="sm" color="gray.600">
            Already have an account?{' '}
            <Link color="blue.500" _hover={{ textDecoration: 'underline' }}  onClick={openLoginModal}>
              Log in
            </Link>
          </Text>
        </div>
      </Flex>

      <Flex p="4" borderTop="1px solid #ccc" justify="center">
        <Text fontSize="sm" color="gray.600">
          &copy; 2024 Convoia. All rights reserved.
        </Text>
      </Flex>

      <Modal isOpen={isSignUpModalOpen} onClose={closeSignUpModal} size="sm" isCentered="true">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign Up</ModalHeader>
          <ModalCloseButton color="black" _hover={{ color: 'gray.500' }} />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                id='name'
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                mb="4"
              />
              <FormLabel>Email</FormLabel>
              <Input
                id='email'
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                mb="4"
              />
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  id='password'
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setPassword(e.target.value)}
                  pr="4.5rem"
                  mb="4"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    color="blue.500"
                    bg="transparent"
                    border="none"
                  >
                    {showPassword ? (
                      <FontAwesomeIcon icon={faEye} />
                    ) : (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeSignUpModal}>
              Close
            </Button>
            <Button colorScheme="blue" variant="ghost" onClick={handleSignup}>
              Sign Up
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal} size="sm" isCentered="true">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton color="black" _hover={{ color: 'gray.500' }} />
          <ModalBody>
            <FormControl>
            <FormLabel>Email</FormLabel>
              <Input
                id='email'
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                mb="4"
              />
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  id='password'
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setPassword(e.target.value)}
                  pr="4.5rem"
                  mb="4"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    color="blue.500"
                    bg="transparent"
                    border="none"
                  >
                    {showPassword ? (
                      <FontAwesomeIcon icon={faEye} />
                    ) : (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeLoginModal}>
              Close
            </Button>
            <Button colorScheme="blue" variant="ghost" onClick={handleLogin}>
              Log In
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Homepage;