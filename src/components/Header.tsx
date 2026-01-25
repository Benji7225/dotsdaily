import { Link } from 'react-router-dom';
import { Circle, User, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { user, signInWithGoogle, signOut, loading } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

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
              {t('nav.home')}
            </Link>
            <Link to="/generator" className="text-gray-700 hover:text-black transition-colors">
              {t('nav.generator')}
            </Link>

            <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
              <button
                onClick={() => setLanguage('fr')}
                className={`text-2xl hover:scale-110 transition-transform ${language === 'fr' ? 'opacity-100' : 'opacity-40'}`}
                title="Français"
              >
                🇫🇷
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`text-2xl hover:scale-110 transition-transform ${language === 'en' ? 'opacity-100' : 'opacity-40'}`}
                title="English"
              >
                🇬🇧
              </button>
            </div>

            {!loading && (
              <>
                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {user.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt={user.user_metadata?.name || 'User'}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <span className="text-gray-700 font-medium hidden sm:block">
                        {user.user_metadata?.name?.split(' ')[0] || 'User'}
                      </span>
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                        <button
                          onClick={async () => {
                            await signOut();
                            setShowDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('nav.signOut')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={signInWithGoogle}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    {t('nav.signIn')}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
