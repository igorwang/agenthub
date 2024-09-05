import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
  hideCloseButton?: boolean;
  primaryButtonColor?: "primary" | "secondary" | "success" | "warning" | "danger";
  secondaryButtonColor?: "primary" | "secondary" | "success" | "warning" | "danger";
}

const GenericModal: React.FC<GenericModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  primaryButtonText,
  secondaryButtonText = "Close",
  onPrimaryAction,
  onSecondaryAction,
  hideCloseButton = false,
  primaryButtonColor = "primary",
  secondaryButtonColor = "primary",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} hideCloseButton={hideCloseButton}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          {onSecondaryAction ? (
            <Button
              color={secondaryButtonColor}
              variant="light"
              onPress={onSecondaryAction}>
              {secondaryButtonText}
            </Button>
          ) : (
            <Button color={secondaryButtonColor} variant="light" onPress={onClose}>
              {secondaryButtonText}
            </Button>
          )}
          <Button
            color={primaryButtonColor}
            onPress={() => {
              onPrimaryAction();
              onClose();
            }}>
            {primaryButtonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GenericModal;
