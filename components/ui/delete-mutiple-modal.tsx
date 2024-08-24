import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";

interface DeleteMultipleModalProps {
  ids: (string | number)[];
  title: string;
  name: string;
  isOpen: boolean;
  onClose: () => void;
  onAffirm: (ids: (string | number)[]) => void;
}

const DeleteMultipleModal: React.FC<DeleteMultipleModalProps> = ({
  ids,
  title,
  name,
  isOpen,
  onClose,
  onAffirm,
}) => {
  return (
    <Modal isOpen={isOpen} hideCloseButton={true}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to remove these {ids.length} {name}
            {ids.length > 1 ? "s" : ""}?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="danger"
            onPress={() => {
              onAffirm(ids);
              onClose();
            }}>
            Affirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteMultipleModal;
