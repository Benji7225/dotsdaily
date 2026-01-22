import { Link } from 'react-router-dom';
import { Calendar, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <Calendar className="w-5 h-5 text-orange-500" />
              Life Calendar
            </div>
            <p className="text-sm leading-relaxed">
              Transformez votre perception du temps avec des fonds d'écran qui visualisent votre vie.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-orange-500 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-sm hover:text-orange-500 transition-colors">
                  Créer un Fond d'Écran
                </Link>
              </li>
              <li>
                <Link to="/examples" className="text-sm hover:text-orange-500 transition-colors">
                  Exemples
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm hover:text-orange-500 transition-colors">
                  À Propos
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm hover:text-orange-500 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-orange-500 transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-orange-500 transition-colors">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {currentYear} Life Calendar. Tous droits réservés.
          </p>
          <p className="text-sm flex items-center gap-1">
            Fait avec <Heart className="w-4 h-4 text-orange-500" /> pour vous aider à vivre pleinement
          </p>
        </div>
      </div>
    </footer>
  );
}
