
import React, { useState } from 'react';
import { Menu, X, Home, Info, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white dark:bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/leaf-logo.svg" 
              alt="New Leaf Logo" 
              className="h-10 w-10"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/40x40?text=NL';
              }}
            />
            <span className="text-leaf-dark font-semibold text-xl">New Leaf</span>
          </Link>
          <button 
            className="p-2 rounded-md hover:bg-muted transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div 
        className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
      />

      {/* Mobile menu */}
      <nav className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <span className="text-leaf-dark font-semibold">Menu</span>
            <button 
              className="p-2 rounded-md hover:bg-muted transition-colors"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <ul className="p-4 space-y-4">
          <li>
            <Link 
              to="/" 
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted transition-colors"
              onClick={closeMenu}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/questionnaire" 
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted transition-colors"
              onClick={closeMenu}
            >
              <FileText size={20} />
              <span>Questionnaire</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted transition-colors"
              onClick={closeMenu}
            >
              <Info size={20} />
              <span>About</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/policy" 
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted transition-colors"
              onClick={closeMenu}
            >
              <FileText size={20} />
              <span>Privacy Policy</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
