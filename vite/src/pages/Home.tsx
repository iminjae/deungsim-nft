import { Flex, Image, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { OutletContext } from "../components/Layout";
import { useOutletContext } from "react-router-dom";

const Home: FC = () => {
  const [balanceOf, setBalanceOf] = useState<number>(0);
  const { mintContract, signer } = useOutletContext<OutletContext>();


  const getBalanceOf = async () => {
    try {
      const response = await mintContract?.balanceOf(signer?.address);

      setBalanceOf(Number(response));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!mintContract || !signer) return;

    getBalanceOf();
  }, [mintContract, signer]);

  return <Flex>
   
    <Image  src="/images/home.jpg" width="100%"
        height="500px"
        objectFit="cover" />


    
  </Flex>;
};

export default Home;