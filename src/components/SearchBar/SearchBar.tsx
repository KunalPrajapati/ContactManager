import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchQuery } from '../../store/contactsSlice';
import SearchIcon from '../../assets/svg/SearchIcon.svg';
import './SearchBar.css';

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.contacts.searchQuery);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by Name, Contact, Email, State..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />
      <img src={SearchIcon} alt="Search" className="search-icon" />
    </div>
  );
};

export default SearchBar;

