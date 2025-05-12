import React from "react";
import ReactDOM from "react-dom";
import "./styles.scss";

export interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  showCloseIcon?: boolean;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
  showCloseIcon = true,
  footer,
  size = "md",
}) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className="modal-overlay">
      <div className={`custom-modal modal-${size}`}>
        {showCloseIcon && (
          <button className="close-icon" onClick={onClose}>
            &times;
          </button>
        )}
        {title && <h5 className="modal-title">{title}</h5>}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
