import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { OutletContext } from "../components/Layout";
import { useOutletContext } from "react-router-dom";
import MarketCard from "../components/MarketCard";
import { FaWallet } from "react-icons/fa";



// const PAGE = 8;

const Market: FC = () => {

    const [tokenIds, setTokenIds] = useState<number[]>([]);
    const [isEnd, setIsEnd] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { signer, saleContract, mintContract } =
        useOutletContext<OutletContext>();

    const getOnSaleTokens = async () => {
        try {
            setIsLoading(true);
            const response = await saleContract?.getOnSaleTokens();

            const temp = response.map((v: any) => {
                return Number(v);
            });

            

            setTokenIds(temp);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!saleContract) return;

        getOnSaleTokens();
    }, [saleContract]);



    return (
        <Flex w="100%" alignItems="center" flexDir="column" gap={2} mt={4} mb={20}>
            {signer ? (
                <>
                    <Grid
                        templateColumns={[
                            "repeat(4, 1fr)",

                        ]}
                        gap={1}
                    >
                        {tokenIds.map((v, i) => (
                            <MarketCard
                                key={i}
                                tokenId={v}
                                mintContract={mintContract}
                                saleContract={saleContract}
                                signer={signer}
                                tokenIds={tokenIds}
                                setTokenIds={setTokenIds}
                            />
                        ))}
                    </Grid>
                    {!isEnd && (
                        <Button
                            mt={8}
                            onClick={() => getOnSaleTokens()}
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
    )

};

export default Market;