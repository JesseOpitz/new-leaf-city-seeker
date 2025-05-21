
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <img 
              src="https://raw.githubusercontent.com/JesseOpitz/new-leaf-city-seeker/main/public/leaf-logo.svg" 
              alt="New Leaf Logo" 
              className="h-8 w-8 mr-2"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/32x32?text=NL';
              }}
            />
            <span className="text-xl font-medium text-leaf-dark">New Leaf</span>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="text-gray-700 hover:text-leaf-dark focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-leaf-dark transition-colors">
              Home
            </Link>
            <Link to="/questionnaire" className="text-gray-700 hover:text-leaf-dark transition-colors">
              Questionnaire
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-leaf-dark transition-colors">
              About
            </Link>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-leaf-dark transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/questionnaire" 
                className="text-gray-700 hover:text-leaf-dark transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Questionnaire
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-leaf-dark transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
