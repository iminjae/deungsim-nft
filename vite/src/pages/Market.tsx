import { Grid } from "@chakra-ui/react";
import { FC, useState } from "react";
import { OutletContext } from "../components/Layout";
import { useOutletContext } from "react-router-dom";
import MarketCard from "../components/MarketCard";

const Market: FC = () => {


    const { mintContract, signer } = useOutletContext<OutletContext>();

    const [tokenIds, setTokenIds] = useState<number[]>([]);


   


    return (
        <Grid
            templateColumns={[
                "repeat(1, 1fr)",
                "repeat(1, 1fr)",
                "repeat(2, 1fr)",
            ]}
            gap={6}
        >
        {tokenIds.map((v, i) => (
            <MarketCard
              key={i}
              tokenId={v}
              mintContract={mintContract}
              signer={signer}
              tokenIds={tokenIds}
              setTokenIds={setTokenIds}
            />
          ))}
        </Grid>
    )

};

export default Market;