import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
} from "@chakra-ui/react";
import { FC } from "react";

interface MintModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string ;
    titleMessage: string ;

}

const CreateOkModal: FC<MintModalProps> = ({ isOpen, onClose, message, titleMessage }) => {
    return (
        <Modal  isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
        <ModalContent>
          <ModalHeader>{titleMessage}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{message}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
};

export default CreateOkModal;