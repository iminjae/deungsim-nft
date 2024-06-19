import {

    Box,
    Button,
    Flex,
    Icon,
    Image,
    SimpleGrid,
    Text,
    useDisclosure,

} from "@chakra-ui/react";
import {
    mintContractAddress
} from "../abis/contractAddress";
import { FC, useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { formatEther } from "ethers";
import { FaEthereum } from "react-icons/fa";
import { OutletContext } from "../components/Layout";
import CreateOkModal from "../components/CreateOkModal";



const DetailMarketItem: FC = () => {


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { state } = useLocation();
    const { nftMetadata } = state;
    const { tokenId } = state;
    const [tokenIds, setTokenIds] = useState<number[]>([]);
    const { saleContract } = useOutletContext<OutletContext>();
    const [message, setMessage] = useState<string>("");
    const [titleMessage, setTitleMessage] = useState<string>("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    const getOnSaleTokens = async () => {
        try {
            const response = await saleContract?.getOnSaleTokens();

            const temp = response.map((v: any) => {
                return Number(v);
            });

            setTokenIds(temp);
        } catch (error) {
            console.error(error);
        }
    };

    const onClickPurchaseNft = async () => {
        try {
            setIsLoading(true);

            const response = await saleContract?.purchaseNft(tokenId, {
                value: nftMetadata?.price


            });

            await response.wait();

            const temp = tokenIds.filter((v) => {
                if (v !== tokenId) {
                    return v;
                }
            });

            setTokenIds(temp);
            setMessage("구매가 완료되었습니다.");
            setTitleMessage("구매 완료!");

            setIsLoading(false);
            onOpen();

        } catch (error) {
            console.error(error);
            setTitleMessage("구매 실패!");
            setMessage("구매에 실패 했습니다.");
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        onClose();
        navigate("/myList");
    };


    useEffect(() => {
        if (!saleContract) return;

        getOnSaleTokens();
    }, [saleContract]);

    return (

        <Box maxW="600px" mx="auto" borderWidth="1px" borderRadius="lg" overflow="hidden" mt={10} mb={10} borderColor="gray.700" >
            <Image src={nftMetadata.image} alt={nftMetadata.name} borderBottom="1px" />
            <Box p={5}>
                <Text fontSize="3xl" fontWeight="bold" mt={2}>{nftMetadata.name}</Text>
                <Text fontSize="2xl" mt={2}>{nftMetadata.description}</Text>
                <SimpleGrid columns={3} spacing={50} mt={10} mb={10}>
                    {nftMetadata.attributes?.map((v: any, i: any) => (
                        <Box key={i}>
                            <Text fontSize="2xl" >{v.trait_type} : {v.value}</Text>
                        </Box>
                    ))}
                </SimpleGrid>
                {nftMetadata.price ? (
                    <Flex
                        w="100%"
                        justifyContent="center"
                        alignItems="center"
                        mb={10}
                    >
                        <Flex alignItems="center" fontSize="5xl">
                            <Text>{formatEther(nftMetadata?.price)}</Text>
                            <Icon as={FaEthereum} ml={1} />
                        </Flex>
                        <Button
                            ml={2}
                            colorScheme="blue"
                            onClick={onClickPurchaseNft}
                            isLoading={isLoading}
                            loadingText="로딩중"
                            size="lg"
                        >
                            구매
                        </Button>
                    </Flex>

                ) : (
                    ""
                )}

                <Text mt={2} fontSize="sm" color="gray.500">Token ID: {tokenId}</Text>
                <Text color="gray.500" fontSize="sm">Contract Address: {mintContractAddress}</Text>
            </Box>
            <CreateOkModal isOpen={isOpen} onClose={handleCloseModal} message={message} titleMessage={titleMessage}/>
        </Box>
    );

};

export default DetailMarketItem;