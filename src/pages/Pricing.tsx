import { Check, Lock, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function Pricing() {
  const { t } = useLanguage();
  const { user, session, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('success') || url.searchParams.has('canceled')) {
      url.searchParams.delete('success');
      url.searchParams.delete('canceled');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const handleSubscribe = async () => {
    if (!user || !session) {
      await signInWithGoogle();
      return;
    }

    setLoading(true);

    try {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete('canceled');
      const returnUrl = currentUrl.toString();

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">{t('pricing.free.name')}</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl sm:text-4xl font-bold text-black">0€</span>
                <span className="text-sm sm:text-base text-gray-600">{t('pricing.free.period')}</span>
              </div>
              <p className="text-sm sm:text-base text-gray-600">{t('pricing.free.description')}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {t('pricing.free.features').map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled
              className="w-full bg-gray-100 text-gray-500 px-6 py-3 rounded-lg font-semibold cursor-not-allowed text-sm sm:text-base"
            >
              {t('pricing.free.cta')}
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl border-2 border-orange-400 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white text-orange-500 px-3 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t('pricing.premium.badge')}</span>
              <span className="sm:hidden">Premium</span>
            </div>

            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('pricing.premium.name')}</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl sm:text-4xl font-bold text-white">2,99€</span>
                <span className="text-sm sm:text-base text-orange-100">{t('pricing.premium.period')}</span>
              </div>
              <p className="text-sm sm:text-base text-orange-50">{t('pricing.premium.description')}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {t('pricing.premium.features').map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-white">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-white text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? t('pricing.premium.ctaLoading') : t('pricing.premium.cta')}
            </button>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6 sm:mb-8">
            {t('pricing.comparison.title')}
          </h2>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                    {t('pricing.comparison.feature')}
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-900">
                    <span className="hidden sm:inline">{t('pricing.free.name')}</span>
                    <span className="sm:hidden">Free</span>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-orange-500">
                    <span className="hidden sm:inline">{t('pricing.premium.name')}</span>
                    <span className="sm:hidden">Premium</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {t('pricing.comparison.items').map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 flex items-center gap-2">
                      {item.premium && <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />}
                      <span>{item.name}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                      {item.free ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
