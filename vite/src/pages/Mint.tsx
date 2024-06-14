import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { FC, useState } from "react";






const Mint: FC = () => {

    const pinataSDK = require('@pinata/sdk');
    const pinata = new pinataSDK({ pinataApiKey: '', pinataSecretApiKey: '' });


    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [gram, setGram] = useState<string>("");
    const [origin, setOrigin] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [tag, setTag] = useState<string>("");

    // 이미지 to IPFS
    const pinFileToIPFS = () => {
        try {
            
            console.log(image);
            
            const fs = require('fs');
            const readableStreamForFile = fs.createReadStream(image);
            const options = {
                pinataMetadata: {
                    name: "deungsim_images",
                    keyvalues: {
                        customKey: 'customValue',
                        customKey2: 'customValue2'
                    }
                },
                pinataOptions: {
                    cidVersion: 0
                }
            };


            pinata.pinFileToIPFS(readableStreamForFile, options);

        } catch (error) {
            console.error(error);
        }
    };

    const onClickSubmit = async () => {
        try {
            if (!name || !price || !gram || !origin || !comment || !image || !tag) return;

            //setIsLoading(true);

            const imgToIpfs = pinFileToIPFS();

            //await response.wait();



            // setIsLoading(false);
        } catch (error) {
            console.error(error);

            //   setIsLoading(false);
        }
    };








    return <Flex>

        <Box>
            이름 : <Input value={name} onChange={(e) => setName(e.target.value)} />
            가격 : <Input value={price} onChange={(e) => setPrice(e.target.value)} />
            그램 : <Input value={gram} onChange={(e) => setGram(e.target.value)} />
            원산지 : <Input value={origin} onChange={(e) => setOrigin(e.target.value)} />
            설명 : <Input value={comment} onChange={(e) => setComment(e.target.value)} />
            사진 : <Input value={image} onChange={(e) => setImage(e.target.value)} />
            등급 : <Input value={tag} onChange={(e) => setTag(e.target.value)} />
        </Box>
        <Button
            ml={2}
            onClick={onClickSubmit}
        // isDisabled={isLoading}
        // isLoading={isLoading}
        // loadingText="로딩중"
        >
            등록
        </Button>

    </Flex>;
};

export default Mint;