import {
  Box,
  Flex,
  Icon,
  Image,
  Text,
} from "@chakra-ui/react";
import { Contract, JsonRpcSigner, formatEther } from "ethers";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEthereum } from "react-icons/fa";

interface MarketCardProps {
  tokenId: number;
  mintContract: Contract | null;
  saleContract: Contract | null;
  signer: JsonRpcSigner | null;
  tokenIds: number[];
  setTokenIds: Dispatch<SetStateAction<number[]>>;
}

const MarketCard: FC<MarketCardProps> = ({
  tokenId,
  mintContract,
  saleContract,

}) => {

  const navigate = useNavigate();

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
    if (!saleContract || !tokenId || !mintContract) return;

    getNftMetadata();
  }, [saleContract, mintContract, tokenId]);




  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      borderColor="gray.700"
      m={2}
      _hover={{ borderColor: 'gray.900', borderWidth: '2px' }}
      onClick={() => navigate("/detailMarketItem", { state: { nftMetadata: nftMetadata, tokenId: tokenId } })}
    >
      <Image
        src={nftMetadata?.image}
        alt={nftMetadata?.name}
        width="100%"
        height="250px"
        objectFit="cover"
        borderBottom="1px"
      />

      <Box p="3">
        <Box alignItems="baseline">
          <Text
            fontSize="2xl"
          >
            {nftMetadata?.name}
          </Text>
        </Box>

        {nftMetadata?.price ? (
          <Flex alignItems="center" mt={5} textColor="gray.600" fontSize="lg">
            <Icon as={FaEthereum}/>
            <Text>{formatEther(nftMetadata?.price)}</Text>
            
          </Flex>


        ) : (
          ""
        )}

      </Box>
    </Box>
  );
};

export default MarketCard;