import { Flex, Image } from "@chakra-ui/react";
import { FC } from "react";


const Home: FC = () => {

  return <Flex>
   
    <Image  src="/images/home.jpg" width="100%"
        height="500px"
        objectFit="cover" />
    
  </Flex>;
};

export default Home;