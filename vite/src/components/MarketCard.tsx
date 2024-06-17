import {
    Box,
    Flex,
    GridItem,
    Image,
    Text,
} from "@chakra-ui/react";
import axios from "axios";
import { Contract, JsonRpcSigner } from "ethers";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

interface MarketNftCardProps {
    tokenId: number;
    mintContract: Contract | null;
    signer: JsonRpcSigner | null;
    tokenIds: number[];
    setTokenIds: Dispatch<SetStateAction<number[]>>;
}

const SaleNftCard: FC<MarketNftCardProps> = ({
    tokenId,
    mintContract,

}) => {

    const [nftMetadata, setNftMetadata] = useState<MarketNftMetadata>();

    const getNftMetadata = async () => {
        try {
            const tokenURI = await mintContract?.tokenURI(tokenId);

            const metadataResponse = await axios.get<NftMetadata>(tokenURI);
            const priceResponse = await saleContract?.getTokenPrice(tokenId);
            const ownerResponse = await mintContract?.ownerOf(tokenId);

            setNftMetadata({
                ...metadataResponse.data,
                price: priceResponse,
                tokenOwner: ownerResponse,
            });
        } catch (error) {
            console.error(error);
        }
    };

    

    useEffect(() => {
        if (!tokenId || !mintContract) return;

        getNftMetadata();
    }, [saleContract, mintContract, tokenId]);

    useEffect(() => console.log(nftMetadata), [nftMetadata]);

    return (
        <GridItem display="flex" flexDir="column">
            {nftMetadata ? (
                <>
                    <Image
                        alignSelf="center"
                        src={nftMetadata.image}
                        alt={nftMetadata.name}
                    />
                   
                    <Flex flexWrap="wrap" mt={4} gap={2}>
                        {nftMetadata.attributes?.map((w, j) => (
                            <Box key={j} border="2px solid olive" p={1}>
                                <Text borderBottom="2px solid olive">{w.trait_type}</Text>
                                <Text>{w.value}</Text>
                            </Box>
                        ))}
                    </Flex>
                    
                </>
            ) : (
                ""
            )}
        </GridItem>
    );
};

export default SaleNftCard;