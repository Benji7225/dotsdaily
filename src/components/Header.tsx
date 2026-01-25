import { Link } from 'react-router-dom';
import { Circle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

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

            <Link
              to="/generator"
              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              {t('nav.getStarted')}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
