import { Flex } from "@chakra-ui/react";
import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { JsonRpcSigner } from "ethers";
import { Contract } from "ethers";
import Footer from "./Footer";

export interface OutletContext {
  mintContract: Contract | null;
  saleContract: Contract | null;
  signer: JsonRpcSigner | null;
}

const Layout: FC = () => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [mintContract, setMintContract] = useState<Contract | null>(null);
  const [saleContract, setSaleContract] = useState<Contract | null>(null);

  return (
    <Flex  mx="auto" minH="100vh" flexDir="column" >
      <Header
        signer={signer}
        setSigner={setSigner}
        setMintContract={setMintContract}
        setSaleContract={setSaleContract}

      />
      <Flex flexGrow={1} mt={20}>
        <Outlet context={{ mintContract, saleContract, signer }} />
      </Flex>
      <Footer /> 
    </Flex>
  );
};

export default Layout;