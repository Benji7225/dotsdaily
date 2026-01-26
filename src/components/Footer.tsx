import { Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Circle className="w-6 h-6 text-orange-500 fill-orange-500" />
              <span className="text-xl font-bold text-black">DotsDaily</span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-3">{t('footer.product')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/generator" className="text-gray-600 hover:text-black transition-colors">
                  {t('footer.generator')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-black transition-colors">
                  {t('nav.pricing')}
                </Link>
              </li>
              <li>
                <a href="/#features" className="text-gray-600 hover:text-black transition-colors">
                  {t('footer.features')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-3">{t('footer.support')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-black transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-black transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-black transition-colors">
                  {t('footer.about')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-3">{t('footer.legal')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-black transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-black transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-gray-600 hover:text-black transition-colors">
                  {t('footer.legalNotice')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} DotsDaily. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
