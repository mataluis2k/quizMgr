import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <FileQuestion size={28} className="text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">QuizCraft</span>
          </Link>
          
          <nav className="flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                location.pathname === '/'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/builder"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                location.pathname.includes('/builder') && !location.pathname.includes('/builder/')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Create Quiz
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;