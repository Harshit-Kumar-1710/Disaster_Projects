import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isLandingPage = location.pathname === '/';
  const isTransparent = isLandingPage && !isMenuOpen && !isProfileOpen;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isTransparent ? 'bg-transparent' : 'bg-white shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className={`h-8 w-8 ${isTransparent ? 'text-white' : 'text-blue-800'}`} />
            <span className={`text-xl font-bold ${isTransparent ? 'text-white' : 'text-blue-800'}`}>
              Safescape
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {currentUser ? (
              <>
                <Link to="/dashboard" className={`font-medium hover:text-blue-700 transition ${isTransparent ? 'text-white hover:text-blue-100' : 'text-gray-700'}`}>
                  Dashboard
                </Link>
                <div className="relative">
                  <button
                    onClick={toggleProfile}
                    className={`flex items-center space-x-2 font-medium hover:text-blue-700 transition ${isTransparent ? 'text-white hover:text-blue-100' : 'text-gray-700'}`}
                  >
                    <User className="h-5 w-5" />
                    <span>{currentUser.name}</span>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <div className="flex items-center space-x-2">
                            <LogOut className="h-4 w-4" />
                            <span>Sign out</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={`font-medium hover:text-blue-700 transition ${isTransparent ? 'text-white hover:text-blue-100' : 'text-gray-700'}`}>
                  Login
                </Link>
                <Link to="/signup" className="btn-primary py-2">
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden flex items-center"
          >
            {isMenuOpen ? (
              <X className={`h-6 w-6 ${isTransparent ? 'text-white' : 'text-gray-800'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isTransparent ? 'text-white' : 'text-gray-800'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentUser ? (
              <>
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium text-gray-800">{currentUser.email}</p>
                </div>
                <Link to="/dashboard" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <div className="flex items-center space-x-2">
                    <LogOut className="h-5 w-5" />
                    <span>Sign out</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/signup" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;