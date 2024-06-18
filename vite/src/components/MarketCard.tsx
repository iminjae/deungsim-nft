import {
  Box,
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
  signer,
  tokenIds,
  setTokenIds,
}) => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const onClickPurchaseNft = async () => {
    try {
      setIsLoading(true);

      const response = await saleContract?.purchaseNft(tokenId, {
        value: nftMetadata?.price,
      });

      await response.wait();

      const temp = tokenIds.filter((v) => {
        if (v !== tokenId) {
          return v;
        }
      });

      setTokenIds(temp);

      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!saleContract || !tokenId || !mintContract) return;

    getNftMetadata();
  }, [saleContract, mintContract, tokenId]);




  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" m={2} _hover={{ borderColor: 'gray.800', borderWidth: '2px' }} onClick={() => navigate("/detailMarketItem", { state: { nftMetadata: nftMetadata, tokenId: tokenId} })}>
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

          {nftMetadata?.price ? (
            <Text>{formatEther(nftMetadata?.price)} <FaEthereum /></Text>
          ):(
            ""
          )}
        </Text>
      </Box>
    </Box>
  );
};

export default MarketCard;