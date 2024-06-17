import { Box, Button, Flex, Image, Input, Text } from "@chakra-ui/react";
import { FC, useState } from "react";
import { OutletContext } from "../components/Layout";
import { useOutletContext } from "react-router-dom";
import { FaWallet } from "react-icons/fa";

const Mint: FC = () => {

    const { mintContract, signer } = useOutletContext<OutletContext>();

    const [name, setName] = useState<string>("");
    const [gram, setGram] = useState<string>("");
    const [origin, setOrigin] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [tag, setTag] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);

    const [imgIpfsHash, setImgIpfsHash] = useState<string | null>(null);
    const [jsonIpfsHash, setJsonIpfsHash] = useState<string | null>(null);



    const onClickSubmit = async () => {
        try {

            if (!name  || !gram || !origin || !comment || !tag || !image || !mintContract) return;

            setLoading(true);

            const imgIPFS = await pinFileToIPFS();
            setImgIpfsHash(imgIPFS);

            const jsonIPFS = await pinJsonToIPFS(imgIPFS);
            setJsonIpfsHash(jsonIPFS);

            const metadataUri = "https://gateway.pinata.cloud/ipfs/" + jsonIPFS;
            const response = await mintContract.mintNft(metadataUri);
            await response.wait();

        } catch (error) {
            console.error(error);
            setLoading(false);
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
            image: imgIPFS,
            attributes: [
                {
                    "trait_type": "그램",
                    "value": gram,
                },
                {
                    "trait_type": "등급",
                    "value": tag
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

    return (
        signer ? (
            <>
                < Flex >
                    <Box>
                        이름 : <Input value={name} onChange={(e) => setName(e.target.value)} />
                        그램 : <Input value={gram} onChange={(e) => setGram(e.target.value)} />
                        원산지 : <Input value={origin} onChange={(e) => setOrigin(e.target.value)} />
                        설명 : <Input value={comment} onChange={(e) => setComment(e.target.value)} />
                        등급 : <Input value={tag} onChange={(e) => setTag(e.target.value)} />
                        사진 :<Input type="file" onChange={handleFileChange} />
                        <Button onClick={onClickSubmit} isDisabled={loading} isLoading={loading} loadingText="로딩중">
                            등록
                        </Button>
                    </Box>
                </Flex >
            </>
        ) : (
            <Text> <FaWallet /> 연결이 필요합니다.</Text>
        )
    )

};

export default Mint;