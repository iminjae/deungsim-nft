import { Box, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HoverMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
      <Box p={4}>
        <Menu isOpen={isOpen}>
          <MenuButton

        
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            fontWeight="semibold"
          >
            ADMIN PAGE
          </MenuButton>
          <MenuList onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)} textColor="black">
            <MenuItem onClick={() => navigate("/MarketList")}>상품 목록</MenuItem>
            <MenuItem onClick={() => navigate("/createMarketItemForm")}>상품 등록</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    );
  };


export default HoverMenu;