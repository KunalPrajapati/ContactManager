import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contact } from '../types/contact';

interface ContactsState {
  contacts: Contact[];
  searchQuery: string;
  selectedIds: string[];
}

// sample data
const initialContacts: Contact[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    phone: '98734 8332',
    email: 'priya.sharma@example.com',
    addressLine1: 'Plot No. 57',
    addressLine2: 'Industrial Area Phase 2, Chandigarh',
    state: 'Punjab',
    pincode: '160002',
  },
  {
    id: '2',
    name: 'Rahul Mehta',
    phone: '91234 8332',
    email: 'rahul.mehta@example.com',
    addressLine1: 'Unit 4B, MIDC Taloja',
    addressLine2: 'Sector 10, Navi Mumbai',
    state: 'Maharashtra',
    pincode: '410208',
  },
  {
    id: '3',
    name: 'Sneha Rao',
    phone: '82734 8332',
    email: 'sneha.rao@example.com',
    addressLine1: 'Khasra No. 432',
    addressLine2: 'Village Behrampur, Sector 59, Gurugram',
    state: 'Haryana',
    pincode: '122101',
  },

];

const loadFromLocalStorage = (): Contact[] => {
  try {
    const saved = localStorage.getItem('contacts');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load contacts from localStorage:', e);
  }
  return initialContacts;
};


const saveToLocalStorage = (contacts: Contact[]) => {
  try {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  } catch (e) {
    console.error('Failed to save contacts to localStorage:', e);
  }
};

const initialState: ContactsState = {
  contacts: loadFromLocalStorage(),
  searchQuery: '',
  selectedIds: [],
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact: (state, action: PayloadAction<Omit<Contact, 'id'>>) => {
      const newContact: Contact = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.contacts.push(newContact);
      saveToLocalStorage(state.contacts);
    },
    updateContact: (state, action: PayloadAction<Contact>) => {
      const index = state.contacts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
        saveToLocalStorage(state.contacts);
      }
    },
    deleteContact: (state, action: PayloadAction<string>) => {
      state.contacts = state.contacts.filter(c => c.id !== action.payload);
      state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
      saveToLocalStorage(state.contacts);
    },
    bulkDeleteContacts: (state, action: PayloadAction<string[]>) => {
      state.contacts = state.contacts.filter(c => !action.payload.includes(c.id));
      state.selectedIds = [];
      saveToLocalStorage(state.contacts);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleSelectContact: (state, action: PayloadAction<string>) => {
      const index = state.selectedIds.indexOf(action.payload);
      if (index === -1) {
        state.selectedIds.push(action.payload);
      } else {
        state.selectedIds.splice(index, 1);
      }
    },
    toggleSelectAll: (state, action: PayloadAction<string[]>) => {
      const visibleIds = action.payload;
      const allSelected = visibleIds.every(id => state.selectedIds.includes(id));
      if (allSelected) {
        state.selectedIds = state.selectedIds.filter(id => !visibleIds.includes(id));
      } else {
        const newIds = visibleIds.filter(id => !state.selectedIds.includes(id));
        state.selectedIds.push(...newIds);
      }
    },
    clearSelection: (state) => {
      state.selectedIds = [];
    },
  },
});

export const {
  addContact,
  updateContact,
  deleteContact,
  bulkDeleteContacts,
  setSearchQuery,
  toggleSelectContact,
  toggleSelectAll,
  clearSelection,
} = contactsSlice.actions;

export default contactsSlice.reducer;

