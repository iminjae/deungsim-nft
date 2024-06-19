import {

    Box,
    Image,
    SimpleGrid,
    Text,

} from "@chakra-ui/react";
import {
    mintContractAddress
} from "../abis/contractAddress";
import { FC } from "react";
import { useLocation } from "react-router-dom";
import { formatEther } from "ethers";
import { FaEthereum } from "react-icons/fa";



const DetailMarketItem: FC = () => {

    const { state } = useLocation();
    const { nftMetadata } = state;
    const { tokenId } = state;
    const {price} = state;


    console.log(price);
    

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

                {/* {price ? (
                    <Text>가격 : {formatEther(price)} <FaEthereum /></Text>
                ) : (
                    ""
                )} */}

                <Text mt={2} fontSize="sm" color="gray.500">Token ID: {tokenId}</Text>

                <Text color="gray.500" fontSize="sm">Contract Address: {mintContractAddress}</Text>
            </Box>
        </Box>
    );

};

export default DetailMarketItem;