import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t('home.faq.q1.q'), a: t('home.faq.q1.a') },
    { q: t('home.faq.q2.q'), a: t('home.faq.q2.a') },
    { q: t('home.faq.q3.q'), a: t('home.faq.q3.a') },
    { q: t('home.faq.q4.q'), a: t('home.faq.q4.a') },
    { q: t('home.faq.q5.q'), a: t('home.faq.q5.a') },
    { q: t('faq.q6.q'), a: t('faq.q6.a') },
    { q: t('faq.q7.q'), a: t('faq.q7.a') },
    { q: t('faq.q8.q'), a: t('faq.q8.a') },
    { q: t('faq.q9.q'), a: t('faq.q9.a') },
    { q: t('faq.q10.q'), a: t('faq.q10.a') },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-4">{t('faq.title')}</h1>
        <p className="text-xl text-gray-600 mb-12">{t('faq.subtitle')}</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-orange-300 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-black pr-8">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-black mb-2">{t('faq.stillQuestions')}</h3>
          <p className="text-gray-600 mb-4">{t('faq.contactUs')}</p>
          <a
            href="mailto:contact@dotsdaily.app"
            className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            {t('footer.contact')}
          </a>
        </div>
      </div>
    </div>
  );
}
