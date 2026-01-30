import { Check, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('success')) {
      navigate('/generator?success=true');
      return;
    }
    if (url.searchParams.has('canceled')) {
      url.searchParams.delete('canceled');
      window.history.replaceState({}, '', url.toString());
    }
  }, [navigate]);

  const handleSubscribe = (planUrl: string) => {
    window.location.href = planUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
            {language === 'fr' ? 'Choisissez votre abonnement' : 'Choose Your Plan'}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            {language === 'fr' ? 'Essai gratuit de 3 jours, puis choisissez votre formule' : '3 days free trial, then choose your plan'}
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6 sm:p-8 hover:shadow-xl transition-shadow">
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">{language === 'fr' ? 'Mensuel' : 'Monthly'}</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl sm:text-4xl font-bold text-black">$3.49</span>
                <span className="text-sm sm:text-base text-gray-600">{language === 'fr' ? '/mois' : '/month'}</span>
              </div>
              <p className="text-sm sm:text-base text-gray-600">{language === 'fr' ? 'Essai gratuit de 3 jours' : '3 days free trial'}</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">{language === 'fr' ? 'Tous les modes (Année, Vie, Objectif)' : 'All modes (Year, Life, Goal)'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">{language === 'fr' ? 'Tous les modèles iPhone' : 'All iPhone models'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">{language === 'fr' ? 'Thèmes personnalisés illimités' : 'Unlimited custom themes'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">{language === 'fr' ? 'Toutes les formes et couleurs' : 'All shapes & colors'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">{language === 'fr' ? 'URL de mise à jour automatique' : 'Auto-updating URL'}</span>
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe('https://buy.stripe.com/eVq14pcvT5LE9xbexDfMA04')}
              className="w-full bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors text-sm sm:text-base"
            >
              {language === 'fr' ? 'Commencer l\'essai gratuit' : 'Start Free Trial'}
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl border-2 border-orange-400 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white text-orange-500 px-3 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{language === 'fr' ? 'Meilleure offre' : 'Best Value'}</span>
              <span className="sm:hidden">-44%</span>
            </div>

            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{language === 'fr' ? 'Annuel' : 'Annual'}</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl sm:text-4xl font-bold text-white">$23</span>
                <span className="text-sm sm:text-base text-orange-100">{language === 'fr' ? '/an' : '/year'}</span>
              </div>
              <div className="mb-2">
                <span className="inline-block bg-white/20 text-white px-2 py-1 rounded text-xs sm:text-sm font-semibold">
                  {language === 'fr' ? 'Économisez 44%' : 'Save 44%'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-orange-50">{language === 'fr' ? 'Essai gratuit de 3 jours' : '3 days free trial'}</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-white">{language === 'fr' ? 'Tous les modes (Année, Vie, Objectif)' : 'All modes (Year, Life, Goal)'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-white">{language === 'fr' ? 'Tous les modèles iPhone' : 'All iPhone models'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-white">{language === 'fr' ? 'Thèmes personnalisés illimités' : 'Unlimited custom themes'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-white">{language === 'fr' ? 'Toutes les formes et couleurs' : 'All shapes & colors'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-white">{language === 'fr' ? 'URL de mise à jour automatique' : 'Auto-updating URL'}</span>
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe('https://buy.stripe.com/fZufZjdzXb5Y24J0GNfMA05')}
              className="w-full bg-white text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors text-sm sm:text-base"
            >
              {language === 'fr' ? 'Commencer l\'essai gratuit' : 'Start Free Trial'}
            </button>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {language === 'fr' ? 'Profitez de 3 jours d\'essai gratuit. Aucun engagement, annulez à tout moment.' : 'Enjoy 3 days free trial. No commitment, cancel anytime.'}
          </p>
        </div>
      </div>
    </div>
  );
}
