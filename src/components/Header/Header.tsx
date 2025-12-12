import './Header.css';
import ofBusinessLogo from '../../assets/ofBusinessLogo.png';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src={ofBusinessLogo} alt="ofBusiness" className="logo-image" />
        </div>
      </div>
    </header>
  );
};

export default Header;

