import {
    Box,
    Button,
    Flex,
    Icon,
    Image,
    Input,
    InputGroup,
    InputRightAddon,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { Contract, formatEther, parseEther } from "ethers";
import { FC, useEffect, useState } from "react";
import { FaEthereum } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CreateOkModal from "./CreateOkModal";

interface NftCardProps {
    nftMetadata: NftMetadata;
    tokenId: number;
    saleContract: Contract | null;
    isApprovedForAll: boolean;
}

const NftCard: FC<NftCardProps> = ({
    nftMetadata,
    tokenId,
    saleContract,
    isApprovedForAll,
}) => {
    const [currentPrice, setCurrentPrice] = useState<bigint>();
    const [salePrice, setSalePrice] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [message, setMessage] = useState<string>("");
    const [titleMessage, setTitleMessage] = useState<string>("");

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

            setCurrentPrice(parseEther(salePrice));
            setMessage("판매 등록이 완료되었습니다.");
            setTitleMessage("판매 등록 완료!");
            setIsLoading(false);
            onOpen();
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            setMessage("판매 등록에 실패 했습니다.");
            setTitleMessage("판매 등록 실패!");
            onOpen();
        }
    };

    useEffect(() => {
        if (!saleContract || !tokenId) return;

        getTokenPrice();
    }, [saleContract, tokenId]);

    const handleInputClick = (e: any) => {
        e.stopPropagation();
    };


    return (
        <Box borderColor="gray.700" maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" m={2} _hover={{ borderColor: 'gray.900', borderWidth: '2px' }} onClick={() => navigate("/detailAdmItem", { state: { nftMetadata: nftMetadata, tokenId: tokenId, price: currentPrice } })}>
            <Image
                src={nftMetadata?.image}
                alt={nftMetadata?.name}
                borderRadius="lg"
                width="100%"
                height="250px"
                objectFit="cover"
            />

            <Box p="3">
                <Box alignItems="baseline">
                    <Text fontSize="2xl">
                        {nftMetadata?.name}
                    </Text>
                </Box>

                {currentPrice ? (
                    <Flex alignItems="center" mt={10} textColor="gray.600" fontSize="lg">
                        <Icon as={FaEthereum} />
                        <Text>{formatEther(currentPrice)}</Text>
                    </Flex>
                ) :
                    isApprovedForAll ? (<>
                        <InputGroup onClick={handleInputClick}   mt={6}>
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
                            onClick={(e) => {
                                e.stopPropagation();
                                onClickSetForSaleNft();
                            }}
                            isDisabled={isLoading}
                            isLoading={isLoading}
                            loadingText="로딩중"
                            size='md'
                            w="100%"
                            border='2px'
                            borderColor='green.500'
                            mt={3}

                        >
                            판매하기
                        </Button>
                    </>
                    ) : ("")}
            </Box>
            <CreateOkModal isOpen={isOpen} onClose={onClose} message={message} titleMessage={titleMessage}/>
        </Box>
    

    );
};

export default NftCard;