import Modal from '../Modal/Modal';
import DeleteIcon from '../../assets/svg/DeleteIcon.svg';
import './DeleteConfirmModal.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count?: number;
}

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, count = 1 }: DeleteConfirmModalProps) => {
  const isBulk = count > 1;
  const title = isBulk ? `Delete ${count} Contacts` : 'Delete Contact';
  const message = isBulk
    ? `Are you sure you want to delete ${count} contacts? This action cannot be undone.`
    : 'Are you sure you want to delete this contact? This action cannot be undone.';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} icon={<img src={DeleteIcon} alt="Delete" />} size="small">
      <div className="delete-confirm-content">
        <p className="delete-message">{message}</p>
        <div className="delete-actions">
          <button className="btn btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;

