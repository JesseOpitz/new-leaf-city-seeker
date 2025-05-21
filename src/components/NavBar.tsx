
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <img 
              src="https://raw.githubusercontent.com/username/repo-name/main/public/leaf-logo.svg" 
              alt="New Leaf Logo" 
              className="h-8 w-8 mr-2"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/32x32?text=NL';
              }}
            />
            <span className="text-xl font-medium text-leaf-dark">New Leaf</span>
          </Link>
          
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
      </div>
    </nav>
  );
};

export default NavBar;
