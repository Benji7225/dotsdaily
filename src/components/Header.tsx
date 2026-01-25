import { Link } from 'react-router-dom';
import { Circle } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Circle className="w-6 h-6 text-orange-500 fill-orange-500" />
            <span className="text-xl font-bold text-black">DotsDaily</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-black transition-colors">
              Home
            </Link>
            <Link to="/generator" className="text-gray-700 hover:text-black transition-colors">
              Generator
            </Link>
            <Link
              to="/generator"
              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
