import {
    Button,
    Flex,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
} from "@chakra-ui/react";
import { Contract, ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import { FaWallet } from "react-icons/fa";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import mintAbi from "../abis/mintAbi.json";
import saleAbi from "../abis/saleAbi.json";
import HoverMenu from "./HoverMenu";
import {
    mintContractAddress,
    saleContractAddress,
} from "../abis/contractAddress";
import { SiHappycow } from "react-icons/si";


interface HeaderProps {
    signer: JsonRpcSigner | null;
    setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
    setMintContract: Dispatch<SetStateAction<Contract | null>>;
    setSaleContract: Dispatch<SetStateAction<Contract | null>>;
}

const Header: FC<HeaderProps> = ({ signer, setSigner, setMintContract, setSaleContract }) => {
    const navigate = useNavigate();



    

    const onClickMetamask = async () => {
        try {
            if (!window.ethereum) return;

            const provider = new ethers.BrowserProvider(window.ethereum);

            setSigner(await provider.getSigner());
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!signer) {
            setMintContract(null);

            return;
        }

        setMintContract(new Contract(mintContractAddress, mintAbi, signer));
        setSaleContract(new Contract(saleContractAddress, saleAbi, signer));
    }, [signer]);

    return (
        <Flex h={20} justifyContent="space-between" position="fixed" bgColor="gray.800" w='100%' minW="100vh" textColor="white" zIndex="50">
            <Flex
                flexDir={["column", "column", "row"]}
                w={40}
                fontSize={[16, 16, 20]}
                fontWeight="semibold"
                alignItems="center"
                onClick={() => navigate("/")}
                ml={10}
            >
                
                <Icon as={SiHappycow} w={50} h={30}/> MARKET
            </Flex>
            <Flex alignItems="center" gap={[2, 2, 4]}>
                <Button
                    variant="link"
                    colorScheme="black"
                    size={["xs", "xs", "md"]}
                    onClick={() => navigate("/Market")}
                >
                    Market
                </Button>
            </Flex>
            
            

            { signer?.address === "0x8A85E6aF1c3e391C83374b1Be5A7669dF32A3559"? (
                <Flex alignItems="center" gap={[2, 2, 4]}>
                    <HoverMenu />
                </Flex>
            ):(
                <Flex alignItems="center" gap={[2, 2, 4]}>
                    <Button
                    variant="link"
                    colorScheme="black"
                    size={["xs", "xs", "md"]}
                    onClick={() => navigate("/MyList")}
                >
                    MY PAGE
                </Button>
                </Flex>
            )}

            <Flex w={40} justifyContent="end" alignItems="center" mr={10}>
                {signer ? (
                    <Menu>
                        <MenuButton size={["xs", "xs", "md"]} as={Button} >


                            <Flex alignItems="center">
                            <Icon as={FaWallet}/>
                            <Text ml={1}>
                                {signer.address.substring(0, 5)}...
                                {signer.address.substring(signer.address.length - 5)}
                            </Text>
                                
                            </Flex>
                        </MenuButton>
                        <MenuList minW={[20, 20, 40]}>
                            <MenuItem fontSize={[8, 8, 12]} onClick={() => setSigner(null)} textColor="black">
                                Log Out
                            </MenuItem>
                        </MenuList>
                    </Menu>
                ) : (
                    <Button onClick={onClickMetamask} size={["xs", "xs", "md"]}>
                        <FaWallet />    Connect
                    </Button>
                )}
            </Flex>
        </Flex>
    );
};

export default Header;