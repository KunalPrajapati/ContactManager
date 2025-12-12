import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSelectContact, toggleSelectAll } from '../../store/contactsSlice';
import { Contact } from '../../types/contact';
import BinIcon from '../../assets/svg/BinIcon.svg';
import PenIcon from '../../assets/svg/PenIcon.svg';
import './ContactTable.css';

interface ContactTableProps {
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

const ContactTable = ({ onEdit, onDelete }: ContactTableProps) => {
  const dispatch = useAppDispatch();
  const { contacts, searchQuery, selectedIds } = useAppSelector((state) => state.contacts);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;

    const query = searchQuery.toLowerCase();
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.phone.replace(/\s/g, '').includes(query.replace(/\s/g, '')) ||
        contact.state.toLowerCase().includes(query)
    );
  }, [contacts, searchQuery]);

  const visibleIds = useMemo(() => filteredContacts.map((c) => c.id), [filteredContacts]);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  const someVisibleSelected = visibleIds.some((id) => selectedIds.includes(id));

  const handleSelectAll = () => {
    dispatch(toggleSelectAll(visibleIds));
  };

  const handleSelectContact = (id: string) => {
    dispatch(toggleSelectContact(id));
  };

  const formatAddress = (contact: Contact) => {
    const parts = [contact.addressLine1];
    if (contact.addressLine2) parts.push(contact.addressLine2);
    parts.push(`${contact.state}, ${contact.pincode}`);
    return parts.join(', ');
  };

  return (
    <div className="table-wrapper">
      <table className="contact-table">
        <thead>
          <tr>
            <th className="checkbox-col">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                ref={(el) => {
                  if (el) {
                    el.indeterminate = someVisibleSelected && !allVisibleSelected;
                  }
                }}
                onChange={handleSelectAll}
                aria-label="Select all contacts"
              />
            </th>
            <th>Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Address</th>
            <th className="action-col">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-state">
                {searchQuery ? 'No contacts found matching your search.' : 'No contacts yet. Add your first contact!'}
              </td>
            </tr>
          ) : (
            filteredContacts.map((contact) => (
              <tr key={contact.id} className={selectedIds.includes(contact.id) ? 'selected' : ''}>
                <td className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(contact.id)}
                    onChange={() => handleSelectContact(contact.id)}
                    aria-label={`Select ${contact.name}`}
                  />
                </td>
                <td className="name-col">{contact.name}</td>
                <td className="phone-col">{contact.phone}</td>
                <td className="email-col">{contact.email}</td>
                <td className="address-col">{formatAddress(contact)}</td>
                <td className="action-col">
                  <div className="action-buttons">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'}}>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => onEdit(contact)}
                        aria-label={`Edit ${contact.name}`}
                      >
                        <img src={PenIcon} alt="Edit" className="action-icon" />
                      </button>
                      <span>Edit</span>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'}} >
                      <button
                        className="action-btn delete-btn"
                        onClick={() => onDelete(contact)}
                        aria-label={`Delete ${contact.name}`}
                      >
                        <img src={BinIcon} alt="Delete" className="action-icon" />
                      </button>
                      <span>Delete</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTable;

