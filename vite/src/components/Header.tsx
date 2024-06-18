import {
    Button,
    Flex,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
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
        <Flex h={24} justifyContent="space-between">
            <Flex
                flexDir={["column", "column", "row"]}
                w={40}
                fontSize={[16, 16, 20]}
                fontWeight="semibold"
                alignItems="center"
                onClick={() => navigate("/")}
            >
                <Image w={16} src="" alt="로고" /> 소고기
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
            <Flex alignItems="center" gap={[2, 2, 4]}>
                <HoverMenu />
            </Flex>
            <Flex w={40} justifyContent="end" alignItems="center">
                {signer ? (
                    <Menu>
                        <MenuButton size={["xs", "xs", "md"]} as={Button}>
                            {signer.address.substring(0, 5)}...
                            {signer.address.substring(signer.address.length - 5)}
                        </MenuButton>
                        <MenuList minW={[20, 20, 40]}>
                            <MenuItem fontSize={[8, 8, 12]} onClick={() => setSigner(null)}>
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