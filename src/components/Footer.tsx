
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto py-6 bg-muted">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="https://raw.githubusercontent.com/JesseOpitz/new-leaf-city-seeker/main/public/leaf-logo.svg" 
              alt="New Leaf Logo" 
              className="h-8 w-8 mr-2"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/32x32?text=NL';
              }}
            />
            <span className="text-leaf-dark font-medium">New Leaf</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-leaf-dark transition-colors">
              Home
            </Link>
            <Link to="/questionnaire" className="hover:text-leaf-dark transition-colors">
              Questionnaire
            </Link>
            <Link to="/about" className="hover:text-leaf-dark transition-colors">
              About
            </Link>
            <Link to="/policy" className="hover:text-leaf-dark transition-colors">
              Privacy Policy
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} New Leaf
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
