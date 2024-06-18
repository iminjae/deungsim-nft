import {
    Box,
    Button,
    Grid,
    GridItem,
    Image,
    Input,
    InputGroup,
    InputRightAddon,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { Contract, formatEther, parseEther } from "ethers";
import { FC, useEffect, useState } from "react";
import { FaEthereum } from "react-icons/fa";
import { JsonRpcSigner } from "ethers";

interface NftCardProps {
    nftMetadata: NftMetadata;
    tokenId: number;
    mintContract: Contract | null;
    saleContract: Contract | null;
    signer: JsonRpcSigner | null;
}

const NftCard: FC<NftCardProps> = ({
    nftMetadata,
    tokenId,
    mintContract,
    saleContract,
    signer,
}) => {
    const [currentPrice, setCurrentPrice] = useState<bigint>();
    const [salePrice, setSalePrice] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const getTokenPrice = async () => {
        try {
            const response = await saleContract?.getTokenPrice(tokenId);

            setCurrentPrice(response);
        } catch (error) {
            console.error(error);
        }
    };





    const onClickSetForSaleNft = async () => {
        try {
            if (!salePrice || isNaN(Number(salePrice))) return;


            setIsLoading(true);

            const response = await saleContract?.setForSaleNft(
                tokenId,
                parseEther(salePrice)
            );

            await response.wait();

            const approveResponse = await mintContract?.approve(signer, tokenId);
            await approveResponse.wait();

            setCurrentPrice(parseEther(salePrice));

            setIsLoading(false);
        } catch (error) {
            console.error(error);

            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!saleContract || !tokenId) return;

        getTokenPrice();
    }, [saleContract, tokenId]);

    return (

        <Box p={4}>
            <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>

                <GridItem bg={useColorModeValue('white', 'gray.800')} shadow="md" borderWidth="1px" borderRadius="lg" overflow="hidden">
                    <Image src={nftMetadata.image} alt={nftMetadata.name} />

                    <Box p={6}>
                        <Stack spacing={1} >
                            <Text fontWeight="bold" fontSize="xl">{nftMetadata.name}</Text>
                            <Text>{nftMetadata.description}</Text>
                            {nftMetadata.attributes?.map((w, j) => (
                                <Box key={j} p={1} >
                                    <Text >{w.trait_type} {w.value}</Text>
                                </Box>
                            ))}
                        </Stack>

                        {currentPrice ? (
                            <Text>{formatEther(currentPrice)} <FaEthereum /></Text>
                        )
                            : (<>
                                <InputGroup>
                                    <Input
                                        type="number"
                                        value={salePrice}
                                        onChange={(e) => setSalePrice(e.target.value)}
                                        textAlign="right"
                                        isDisabled={isLoading}
                                    />
                                    <InputRightAddon><FaEthereum /></InputRightAddon>
                                </InputGroup>
                                <Button
                                    ml={0}
                                    onClick={onClickSetForSaleNft}
                                    isDisabled={isLoading}
                                    isLoading={isLoading}
                                    loadingText="로딩중"
                                    colorScheme="red"
                                >
                                    판매하기
                                </Button>
                            </>
                            )}





                    </Box>
                </GridItem>

            </Grid>
        </Box>

    );
};

export default NftCard;