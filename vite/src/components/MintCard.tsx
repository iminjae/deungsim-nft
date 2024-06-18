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
import { useNavigate } from "react-router-dom";

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

    const navigate = useNavigate();

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

    const handleInputClick = (e) => {
        e.stopPropagation();
      };
    

    return (
        <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" m={2} _hover={{ borderColor: 'gray.800', borderWidth: '2px' }} onClick={() => navigate("/DetailAdmItem", {state : {nftMetadata:nftMetadata, tokenId:tokenId, price:currentPrice}})}>
            <Image src={nftMetadata?.image} alt={nftMetadata?.name} />

            <Box p="6">
                <Box alignItems="baseline">
                    <Text
                        mt="1"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated
                    >
                        {nftMetadata?.name}
                    </Text>
                </Box>

                <Text mt="2" color="gray.500">
                    {nftMetadata?.description}
                </Text>
                {currentPrice ? (
                            <Text>{formatEther(currentPrice)} <FaEthereum /></Text>
                        )
                            : (<>
                                <InputGroup onClick={handleInputClick}>
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClickSetForSaleNft();
                                      }}
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
        </Box>

       
    );
};

export default NftCard;