import { Box, Button, Flex, Image, Input } from "@chakra-ui/react";
import { FC, useState } from "react";


const Mint: FC = () => {

    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
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

            if (!name || !price || !gram || !origin || !comment || !tag || !image) return;

            setLoading(true);

            const imgIPFS = await pinFileToIPFS();
            setImgIpfsHash(imgIPFS);

            const jsonIPFS = await pinJsonToIPFS(imgIPFS);
            setJsonIpfsHash(jsonIPFS);


        } catch (error) {
            console.error(error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setImage(event.target.files[0]);
        }
    };

    //imageFile to IPFS
    const pinFileToIPFS = async (): Promise<string> => {
        // if (!image) return;

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
                    "trait_type": "가격",
                    "value": price,
                },
                {
                    "trait_type": "그램",
                    "value": gram,
                },
                {
                    "trait_type": "등급",
                    "value": tag
                },
                {
                    "trait_type": "Ability",
                    "value": "Shape Shifting"
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
            // setJsonIpfsHash(data.ipfsHash);
            return data.IpfsHash

        } catch (error) {
            console.error('Error pinning JSON to IPFS:', error);
            throw error;
        }






    };










    return <Flex>

        <Box>
            이름 : <Input value={name} onChange={(e) => setName(e.target.value)} />
            가격 : <Input value={price} onChange={(e) => setPrice(e.target.value)} />
            그램 : <Input value={gram} onChange={(e) => setGram(e.target.value)} />
            원산지 : <Input value={origin} onChange={(e) => setOrigin(e.target.value)} />
            설명 : <Input value={comment} onChange={(e) => setComment(e.target.value)} />

            등급 : <Input value={tag} onChange={(e) => setTag(e.target.value)} />
            사진 :
            <Input
                multiple type="file"
                onChange={handleFileChange}
            />
            {imgIpfsHash && (
                <div>
                    <p>File uploaded successfully. IPFS Hash:</p>
                    <a href={`https://gateway.pinata.cloud/ipfs/${imgIpfsHash}`} target="_blank" rel="noopener noreferrer">
                        {imgIpfsHash}
                    </a>
                    <Image src={`https://gateway.pinata.cloud/ipfs/${imgIpfsHash}`} />
                </div>


            )}
            <Button
                ml={2}
                onClick={onClickSubmit}
                isDisabled={loading}
                isLoading={loading}
                loadingText="로딩중"
            >
                등록
            </Button>
        </Box>

    </Flex>;
};

export default Mint;