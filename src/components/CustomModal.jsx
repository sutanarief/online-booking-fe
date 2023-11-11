import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const CustomModal = ({
  isModalOpen,
  setIsModalOpen,
  title,
  modalBody,
  handleSubmit,
  handleClose,
  footer,
  type
}) => {

  const handleOk = () => {
    handleSubmit()
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    handleClose()
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title={title}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        {...(footer && { footer })}
        {...(type === 'detail' && { okButtonProps: { style: { display: 'none' } } })}
      >
        {modalBody}
      </Modal>
    </>
  );
};
export default CustomModal;