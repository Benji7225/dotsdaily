import { Link, useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-900 hover:text-orange-600 transition-colors">
            <Calendar className="w-6 h-6 text-orange-600" />
            Life Calendar
          </Link>

          <div className="flex items-center gap-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-orange-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/create"
              className={`font-medium transition-colors ${
                isActive('/create') ? 'text-orange-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Créer
            </Link>
            <Link
              to="/examples"
              className={`font-medium transition-colors ${
                isActive('/examples') ? 'text-orange-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Exemples
            </Link>
            <Link
              to="/about"
              className={`font-medium transition-colors ${
                isActive('/about') ? 'text-orange-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              À Propos
            </Link>
            <Link
              to="/faq"
              className={`font-medium transition-colors ${
                isActive('/faq') ? 'text-orange-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FAQ
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
