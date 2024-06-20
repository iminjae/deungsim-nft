import { Box, Flex, Icon, IconButton, Stack, Text } from "@chakra-ui/react";
import { FC } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { SiHappycow } from "react-icons/si";
import { useNavigate } from "react-router-dom";



const Footer: FC = () => {
    const navigate = useNavigate();
    return (
        <Box
            bgColor="gray.800"
            py={10}
            w='100%'
            justifyContent="center"
            textColor="white"

        >
            <Flex
                maxW="6xl"
                mx="auto"
                align="center"
                justify="space-between"
                wrap="wrap"
            >
                <Flex
                    flexDir={["column", "column", "row"]}
                    w={40}
                    fontSize={[16, 16, 20]}
                    fontWeight="semibold"
                    alignItems="center"
                    onClick={() => navigate("/")}
                >

                    <Icon as={SiHappycow} w={50} h={30} /> MARKET
                </Flex>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mt={{ base: 4, md: 0 }}>
                    <Text >About Us</Text>
                    <Text >Services</Text>
                    <Text >Contact</Text>
                    <Text >Privacy Policy</Text>
                </Stack>
                <Stack direction="row" spacing={6}>
                    <IconButton
                        as="a"
                        href="https://twitter.com"
                        aria-label="Twitter"
                        icon={<FaTwitter />}
                    />
                    <IconButton
                        as="a"
                        href="https://facebook.com"
                        aria-label="Facebook"
                        icon={<FaFacebook />}
                    />
                    <IconButton
                        as="a"
                        href="https://instagram.com"
                        aria-label="Instagram"
                        icon={<FaInstagram />}
                    />
                    <IconButton
                        as="a"
                        href="https://linkedin.com"
                        aria-label="LinkedIn"
                        icon={<FaLinkedin />}
                    />
                </Stack>
            </Flex>
            <Text textAlign="center" mt={10} fontSize="lg">
                만든사람 : 이민재
            </Text>
            <Text textAlign="center"  mb={10} fontSize="lg">
                사진출처 : 광진구 대가식당
            </Text>
            <Text textAlign="center" mt={4} fontSize="sm">
                &copy; {new Date().getFullYear()} All rights reserved.
            </Text>
        </Box>

    );
};

export default Footer;
