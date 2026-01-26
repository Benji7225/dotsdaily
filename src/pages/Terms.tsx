import { useLanguage } from '../contexts/LanguageContext';

export default function Terms() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-black mb-6">{t('terms.title')}</h1>
      <p className="text-gray-600 mb-8">{t('terms.lastUpdated')}</p>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('terms.acceptance.title')}</h2>
          <p className="leading-relaxed">{t('terms.acceptance.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('terms.service.title')}</h2>
          <p className="leading-relaxed mb-3">{t('terms.service.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('terms.account.title')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('terms.account.item1')}</li>
            <li>{t('terms.account.item2')}</li>
            <li>{t('terms.account.item3')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('terms.usage.title')}</h2>
          <p className="leading-relaxed mb-3">{t('terms.usage.intro')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('terms.usage.item1')}</li>
            <li>{t('terms.usage.item2')}</li>
            <li>{t('terms.usage.item3')}</li>
            <li>{t('terms.usage.item4')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('terms.intellectual.title')}</h2>
          <p className="leading-relaxed">{t('terms.intellectual.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('terms.payment.title')}</h2>
          <p className="leading-relaxed">{t('terms.payment.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('terms.limitation.title')}</h2>
          <p className="leading-relaxed">{t('terms.limitation.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('terms.termination.title')}</h2>
          <p className="leading-relaxed">{t('terms.termination.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('terms.changes.title')}</h2>
          <p className="leading-relaxed">{t('terms.changes.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('terms.contact.title')}</h2>
          <p className="leading-relaxed">
            {t('terms.contact.content')} <a href="mailto:contact@dotsdaily.app" className="text-orange-600 hover:text-orange-700 underline">contact@dotsdaily.app</a>
          </p>
        </section>
      </div>
    </div>
  );
}
