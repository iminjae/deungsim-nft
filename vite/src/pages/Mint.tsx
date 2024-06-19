import { Box, Button, Flex, FormControl, FormLabel, Icon, Input, Stack, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { FC, useState } from "react";
import { OutletContext } from "../components/Layout";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaWallet } from "react-icons/fa";
import CreateOkModal from "../components/CreateOkModal";

const Mint: FC = () => {

    const { mintContract, signer } = useOutletContext<OutletContext>();

    const [name, setName] = useState<string>("");
    const [gram, setGram] = useState<string>("");
    const [origin, setOrigin] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [tag, setTag] = useState<string>("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [titleMessage, setTitleMessage] = useState<string>("");
    const navigate = useNavigate();

    const [imgIpfsHash, setImgIpfsHash] = useState<string | null>(null);
    const [jsonIpfsHash, setJsonIpfsHash] = useState<string | null>(null);


    const onClickSubmit = async () => {
        try {

            if (!name || !gram || !origin || !comment || !tag || !image || !mintContract) return;

            setLoading(true);

            const imgIPFS = await pinFileToIPFS();
            setImgIpfsHash(imgIPFS);

            const jsonIPFS = await pinJsonToIPFS(imgIPFS);
            setJsonIpfsHash(jsonIPFS);


            const response = await mintContract.mintNft("https://gateway.pinata.cloud/ipfs/" + jsonIPFS);
            await response.wait();

            setMessage("등록이 완료되었습니다.");
            setTitleMessage("등록 완료!");
            setLoading(false);
            onOpen();

        } catch (error) {
            console.error(error);
            setLoading(false);
            setTitleMessage("등록 실패!");
            setMessage("등록에 실패 했습니다.");
            onOpen();
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event);

        if (event.target.files && event.target.files.length > 0) {
            setImage(event.target.files[0]);
        }
    };

    //imageFile to IPFS
    const pinFileToIPFS = async (): Promise<string> => {

        try {
            const data = new FormData();
            data.append('file', image!);

            const metadata = JSON.stringify({
                name: "deungsim_image",
            });

            data.append('pinataMetadata', metadata);

            const pinataOptions = JSON.stringify({
                cidVersion: 0,
            });

            data.append('pinataOptions', pinataOptions);

            const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_APP_PINATA_JWT}`,

                },
                body: data,
            });

            if (!response.ok) {
                console.error('Failed to upload file:', response.statusText);
            }

            const result = await response.json();

            return result.IpfsHash


        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    //jsonfile to IPFS
    const pinJsonToIPFS = async (imgIPFS: string): Promise<string> => {

        const deungsimJson = {
            name: name,
            description: comment,
            image: "https://gateway.pinata.cloud/ipfs/" + imgIPFS,
            attributes: [
                {
                    "trait_type": "그램",
                    "value": gram + "g",
                },
                {
                    "trait_type": "등급",
                    "value": tag
                },
                {
                    "trait_type": "원산지",
                    "value": origin
                }
            ]
        }

        const apiKey = `${import.meta.env.VITE_APP_PINATA_API_KEY}`;
        const secretApiKey = `${import.meta.env.VITE_APP_PINATA_API_SECRET_KEY}`;


        try {

            const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'pinata_api_key': apiKey,
                    'pinata_secret_api_key': secretApiKey,
                },
                body: JSON.stringify(deungsimJson),
            });

            if (!response.ok) {
                throw new Error('Failed to pin JSON to IPFS');

            }

            const data = await response.json();

            return data.IpfsHash

        } catch (error) {
            console.error('Error pinning JSON to IPFS:', error);
            throw error;
        }

    };

    const handleCloseModal = () => {
        onClose();
        navigate("/marketList");
    };

    return (
        signer ? (
            <>
                <Flex w="100%" alignItems="center" flexDir="column" bg={useColorModeValue('gray.50', 'gray.800')}>
                    <Box
                        bg={useColorModeValue('white', 'gray.700')}
                        p={6}
                        rounded="md"
                        shadow="md"
                        w="full"
                        maxW="md"
                        mt={10}
                        mb={10}
                    >
                        <Stack spacing={4}>
                            <FormControl id="name">
                                <FormLabel>이름</FormLabel>
                                <Input value={name} onChange={(e) => setName(e.target.value)} />
                            </FormControl>
                            <FormControl id="gram">
                                <FormLabel>그램</FormLabel>
                                <Input value={gram} onChange={(e) => setGram(e.target.value)}  type="number"/>
                            </FormControl>
                            <FormControl id="origin">
                                <FormLabel>원산지</FormLabel>
                                <Input value={origin} onChange={(e) => setOrigin(e.target.value)} />
                            </FormControl>
                            <FormControl id="comment">
                                <FormLabel>설명</FormLabel>
                                <Input value={comment} onChange={(e) => setComment(e.target.value)} />
                            </FormControl>
                            <FormControl id="tag">
                                <FormLabel>등급</FormLabel>
                                <Input value={tag} onChange={(e) => setTag(e.target.value)} />
                            </FormControl>
                            <FormControl id="photo">
                                <FormLabel>사진</FormLabel>
                                <Input type="file" onChange={handleFileChange} />
                            </FormControl>
                        </Stack>
                    </Box>
                    <Button onClick={onClickSubmit} colorScheme="green" isDisabled={loading} isLoading={loading} loadingText="로딩중" mb={10} >
                        등록
                    </Button>
                </Flex>
                <CreateOkModal isOpen={isOpen} onClose={handleCloseModal} message={message} titleMessage={titleMessage} />
            </>
        ) : (
            <Flex
                w="100%"
                justifyContent="center"
                alignItems="center"
                gap={2}
            >
                <Icon as={FaWallet} ml={1} />
                <Text > 연결이 필요합니다.</Text>
            </Flex>
        )

    )

};

export default Mint;