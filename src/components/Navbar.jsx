import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleWritingClick = () => {
    const hasBuletin = localStorage.getItem('hasBuletin') === 'true';
    navigate(hasBuletin ? '/dashboard' : '/create-buletin');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow bg-white">
      <Link to="/home" className="text-xl font-bold text-blue-600">Buletin</Link>
      <div className="space-x-4">
        <Link to="/home" className="text-gray-700 hover:text-blue-600">Reading</Link>
        <button onClick={handleWritingClick} className="text-gray-700 hover:text-blue-600">
          Writing
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
