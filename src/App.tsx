import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  addContact,
  updateContact,
  deleteContact,
  bulkDeleteContacts,
} from './store/contactsSlice';
import {
  Header,
  SearchBar,
  ContactTable,
  Modal,
  ContactForm,
  DeleteConfirmModal,
  Toast,
  ToastType,
} from './components';
import { Contact, ContactFormData } from './types/contact';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const { selectedIds, contacts, searchQuery } = useAppSelector((state) => state.contacts);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  // Get visible selected count (filtered by search)
  const visibleSelectedCount = selectedIds.filter((id) => {
    if (!searchQuery.trim()) return true;
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return false;
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.phone.replace(/\s/g, '').includes(query.replace(/\s/g, '')) ||
      contact.state.toLowerCase().includes(query)
    );
  }).length;


  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (formData: ContactFormData) => {
    dispatch(
      addContact({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        state: formData.state,
        pincode: formData.pincode,
      })
    );
    setIsAddModalOpen(false);
    showToast('Contact added successfully!', 'success');
  };

  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (formData: ContactFormData) => {
    if (editingContact) {
      dispatch(
        updateContact({
          id: editingContact.id,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2 || undefined,
          state: formData.state,
          pincode: formData.pincode,
        })
      );
      setIsEditModalOpen(false);
      setEditingContact(null);
      showToast('Contact updated successfully!', 'success');
    }
  };


  const handleDeleteClick = (contact: Contact) => {
    setDeletingContact(contact);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingContact) {
      dispatch(deleteContact(deletingContact.id));
      setIsDeleteModalOpen(false);
      setDeletingContact(null);
      showToast('Contact deleted successfully!', 'success');
    }
  };


  const handleBulkDeleteClick = () => {
    setIsBulkDeleteModalOpen(true);
  };

  const handleBulkDeleteConfirm = () => {
    dispatch(bulkDeleteContacts(selectedIds));
    setIsBulkDeleteModalOpen(false);
    showToast(`${selectedIds.length} contacts deleted successfully!`, 'success');
  };


  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingContact(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeletingContact(null);
  };

  const handleBulkDeleteModalClose = () => {
    setIsBulkDeleteModalOpen(false);
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <h1 className="page-title">Contact Manager</h1>
          
          <div className="content-card">
            <div className="toolbar">
              <SearchBar />
              <div className="toolbar-actions">
                {visibleSelectedCount > 0 && (
                  <button className="btn btn-bulk-delete" onClick={handleBulkDeleteClick}>
                    {selectedIds.length > 1 ? 'Bulk Delete' : 'Delete'} ({visibleSelectedCount})
                  </button>
                )}
                <button className="btn btn-add" onClick={handleAddClick}>
                  Add Contact
                </button>
              </div>
            </div>
            
            <ContactTable onEdit={handleEditClick} onDelete={handleDeleteClick} />
          </div>
        </div>
      </main>


      <Modal isOpen={isAddModalOpen} onClose={handleAddModalClose} title="Add Contact">
        <ContactForm onSubmit={handleAddSubmit} onCancel={handleAddModalClose} />
      </Modal>


      <Modal isOpen={isEditModalOpen} onClose={handleEditModalClose} title="Edit Contact">
        <ContactForm
          onSubmit={handleEditSubmit}
          onCancel={handleEditModalClose}
          initialData={editingContact}
          isEditing
        />
      </Modal>


      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        count={1}
      />


      <DeleteConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={handleBulkDeleteModalClose}
        onConfirm={handleBulkDeleteConfirm}
        count={selectedIds.length}
      />


      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}

export default App;
