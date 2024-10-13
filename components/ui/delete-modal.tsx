import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations();

  return (
    <Modal isOpen={isOpen} hideCloseButton={true}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody>
          <p>
            {t("Are you sure you want to delete")} {name}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="light" onPress={onClose}>
            {t("Close")}
          </Button>
          <Button
            color="danger"
            onPress={() => {
              onAffirm(id);
              onClose();
            }}>
            {t("Confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmModal;
