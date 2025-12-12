import { useState, useRef, useEffect } from 'react';
import ArrowIcon from '../../assets/svg/ArrowIcon.svg';
import './Dropdown.css';

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  error?: boolean;
  id?: string;
  name?: string;
}

const Dropdown = ({ value, onChange, options, placeholder = 'Select', error, id, name }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`dropdown ${error ? 'dropdown-error' : ''}`} ref={dropdownRef}>
      <button
        type="button"
        id={id}
        className={`dropdown-trigger ${isOpen ? 'open' : ''} ${value ? 'has-value' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={value ? 'dropdown-value' : 'dropdown-placeholder'}>
          {value || placeholder}
        </span>
        <img
          src={ArrowIcon}
          alt=""
          className={`dropdown-arrow ${isOpen ? 'rotated' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="dropdown-menu" role="listbox">
          {options.map((option) => (
            <div
              key={option}
              className={`dropdown-option ${value === option ? 'selected' : ''}`}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={value === option}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

