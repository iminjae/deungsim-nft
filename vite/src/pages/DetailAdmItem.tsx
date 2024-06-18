import {

    Box,
    Image,
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


    return (

        <Box p={5} maxW="600px" mx="auto" borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Image src={nftMetadata.image} alt={nftMetadata.name} />
            <Box p={5}>
                <Text fontSize="2xl" fontWeight="bold">{nftMetadata.name}</Text>
                설명 : <Text mt={2}>{nftMetadata.description}</Text>
                {nftMetadata.attributes?.map((v, i) => (
                    <Box key={i} p={1} >
                        <Text >{v.trait_type} : {v.value}</Text>
                    </Box>
                ))}
                {nftMetadata.price ? (
                    <Text>가격 : {formatEther(nftMetadata.price)} <FaEthereum /></Text>
                ):(
                    ""
                )}
                
                <Text mt={2} color="gray.500">Token ID: {tokenId}</Text>

                <Text mt={2} color="gray.500">Contract Address: {mintContractAddress}</Text>
            </Box>
        </Box>
    );

};

export default DetailMarketItem;