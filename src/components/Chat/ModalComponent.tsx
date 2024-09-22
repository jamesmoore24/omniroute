import React from "react";
import { Modal } from "antd";

interface ModalComponentProps {
  isOpen: boolean;
  content: string;
  onClose: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  isOpen,
  content,
  onClose,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      style={{ width: "auto" }}
    >
      <p>{content}</p>
    </Modal>
  );
};

export default ModalComponent;
