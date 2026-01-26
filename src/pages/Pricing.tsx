import { Check, Lock, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Pricing() {
  const { t } = useLanguage();
  const { user, session, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user || !session) {
      await signInWithGoogle();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Checkout error:', errorData);
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la création de la session de paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-black mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-black mb-2">{t('pricing.free.name')}</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-black">0€</span>
                <span className="text-gray-600">{t('pricing.free.period')}</span>
              </div>
              <p className="text-gray-600">{t('pricing.free.description')}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {t('pricing.free.features').map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled
              className="w-full bg-gray-100 text-gray-500 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
            >
              {t('pricing.free.cta')}
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl border-2 border-orange-400 p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white text-orange-500 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              {t('pricing.premium.badge')}
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{t('pricing.premium.name')}</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-white">2,99€</span>
                <span className="text-orange-100">{t('pricing.premium.period')}</span>
              </div>
              <p className="text-orange-50">{t('pricing.premium.description')}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {t('pricing.premium.features').map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-white text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('pricing.premium.ctaLoading') : t('pricing.premium.cta')}
            </button>
          </div>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-black mb-8">
            {t('pricing.comparison.title')}
          </h2>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    {t('pricing.comparison.feature')}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    {t('pricing.free.name')}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-orange-500">
                    {t('pricing.premium.name')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {t('pricing.comparison.items').map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-gray-900 flex items-center gap-2">
                      {item.premium && <Lock className="w-4 h-4 text-orange-500" />}
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.free ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-5 h-5 text-orange-500 mx-auto" />
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
