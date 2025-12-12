import { useEffect } from 'react';
import './Modal.css';
import CrossIcon from '../../assets/svg/CrossIcon.svg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'default' | 'small';
}

const Modal = ({ isOpen, onClose, title, children, icon, size = 'default' }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={`modal-backdrop ${size === 'small' ? 'modal-backdrop-top' : ''}`} onClick={handleBackdropClick}>
      <div className={`modal-container ${size === 'small' ? 'modal-small' : ''}`}>
        <div className={`modal-header ${size === 'small' ? 'modal-header-simple' : ''}`}>
          <div className="modal-title-wrapper">
            {icon && <span className="modal-icon">{icon}</span>}
            <h2 className="modal-title">{title}</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <img src={CrossIcon} alt="Close" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

