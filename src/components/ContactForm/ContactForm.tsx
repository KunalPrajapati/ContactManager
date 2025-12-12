import { useState, useEffect } from 'react';
import { Contact, ContactFormData, FormErrors, INDIAN_STATES } from '../../types/contact';
import Dropdown from '../Dropdown/Dropdown';
import './ContactForm.css';

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
  onCancel: () => void;
  initialData?: Contact | null;
  isEditing?: boolean;
}

const emptyFormData: ContactFormData = {
  name: '',
  phone: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  state: '',
  pincode: '',
};

const ContactForm = ({ onSubmit, onCancel, initialData, isEditing }: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>(emptyFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        phone: initialData.phone,
        email: initialData.email,
        addressLine1: initialData.addressLine1,
        addressLine2: initialData.addressLine2 || '',
        state: initialData.state,
        pincode: initialData.pincode,
      });
    } else {
      setFormData(emptyFormData);
    }
    setErrors({});
  }, [initialData]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required.';
        break;
      case 'email':
        if (!value.trim()) return 'Email is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email.';
        break;
      case 'phone':
        if (!value.trim()) return 'Phone number is required.';
        if (!/^[\d\s]+$/.test(value)) return 'Phone must contain only digits.';
        if (value.replace(/\s/g, '').length !== 10) return 'Phone number must be 10 digits.';
        break;
      case 'addressLine1':
        if (!value.trim()) return 'Address Line 1 is required.';
        break;
      case 'state':
        if (!value) return 'State is required.';
        break;
      case 'pincode':
        if (!value.trim()) return 'Pincode is required.';
        if (!/^\d{6}$/.test(value.replace(/\s/g, ''))) return 'Pincode must be 6 digits.';
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof ContactFormData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className='contact-form-parent'>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">
              Name<span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="phone">
              Contact No.<span className="required">*</span>
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter contact no."
              className={errors.phone ? 'error' : ''}
              maxLength={10}
              minLength={10}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">
              Email<span className="required">*</span>
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="addressLine1">
              Address Line 1<span className="required">*</span>
            </label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="Enter address"
              className={errors.addressLine1 ? 'error' : ''}
            />
            {errors.addressLine1 && (
              <span className="error-message">{errors.addressLine1}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="addressLine2">Address Line 2 (Optional)</label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <Dropdown
              id="state"
              name="state"
              value={formData.state}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, state: value }));
                const error = validateField('state', value);
                setErrors((prev) => ({ ...prev, state: error }));
              }}
              options={INDIAN_STATES}
              placeholder="Enter State"
              error={!!errors.state}
            />
            {errors.state && <span className="error-message">{errors.state}</span>}
          </div>
        </div>

        <div className="form-row form-row-single">
          <div className="form-group">
            <label htmlFor="pincode">
              Pincode<span className="required">*</span>
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
              className={errors.pincode ? 'error' : ''}
              maxLength={6}
            />
            {errors.pincode && (
              <span className="error-message">{errors.pincode}</span>
            )}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Update Contact' : 'Add Contact'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;

