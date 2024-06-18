import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import axios from "axios";
import MintCard from "../components/MintCard";
import { FaWallet } from "react-icons/fa";

const PAGE = 8;

const MintList: FC = () => {
  const [nftMetadataArray, setNftMetadataArray] = useState<NftMetadata[]>([]);
  const [balanceOf, setBalanceOf] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const [tokenIds, setTokenIds] = useState<number[]>([]);

  const { mintContract, signer, saleContract } = useOutletContext<OutletContext>();

  const getBalanceOf = async () => {
    try {
      const response = await mintContract?.balanceOf(signer?.address);

      setBalanceOf(Number(response));
    } catch (error) {
      console.error(error);
    }
  };

  const getNftMetadata = async () => {
    try {
      setIsLoading(true);

      const temp: NftMetadata[] = [];
      const tokenIdTemp: number[] = [];

      for (let i = 0; i < PAGE; i++) {
        if (i + currentPage * PAGE >= balanceOf) {
          setIsEnd(true);
          break;
        }

        const tokenOfOwnerByIndex = await mintContract?.tokenOfOwnerByIndex(
          signer?.address,
          i + currentPage * PAGE
        );

        const tokenURI = await mintContract?.tokenURI(tokenOfOwnerByIndex);

        const axiosResponse = await axios.get<NftMetadata>(tokenURI);

        temp.push(axiosResponse.data);
        tokenIdTemp.push(Number(tokenOfOwnerByIndex));
      }

      setNftMetadataArray([...nftMetadataArray, ...temp]);
      setTokenIds([...tokenIds, ...tokenIdTemp]);
      setCurrentPage(currentPage + 1);
      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setIsLoading(false);
    }
  };



  

  useEffect(() => {
    if (!mintContract || !signer) return;

    getBalanceOf();

  }, [mintContract, signer]);

  useEffect(() => {
    if (signer) return;

    setBalanceOf(0);
  }, [signer]);

  useEffect(() => {
    if (!balanceOf) return;

    getNftMetadata();
  }, [balanceOf]);



  return (
    <Flex w="100%" alignItems="center" flexDir="column" gap={2} mt={8} mb={20}>
      {signer ? (
        <>
          <Grid
            templateColumns={[
              "repeat(4, 1fr)",
              
            ]}
            gap={6}
          >
            {nftMetadataArray.map((v, i) => (
              <MintCard
                key={i}
                nftMetadata={v}
                tokenId={tokenIds[i]}
                mintContract={mintContract}
                saleContract={saleContract}
                signer={signer}
              />
            ))}
          </Grid>
          {!isEnd && (
            <Button
              mt={8}
              onClick={() => getNftMetadata()}
              isDisabled={isLoading}
              isLoading={isLoading}
              loadingText="로딩중"
            >
              더 보기
            </Button>
          )}
        </>
      ) : (
        <Text> <FaWallet /> 연결이 필요합니다.</Text>
      )}
    </Flex>
  );
};

export default MintList;