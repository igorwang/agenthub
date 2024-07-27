import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";

interface DeleteConfirmModalProps {
  id: string | number; // 添加 id 属性
  title: string;
  name: string;
  isOpen: boolean;
  onClose: () => void;
  onAffirm: (id: string | number) => void; // 修改 onAffirm 以接收 id
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  id,
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
          <p>Are you sure you want to remove this {name}?</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="danger"
            onPress={() => {
              onAffirm(id);
              onClose();
            }}>
            Affirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmModal;
