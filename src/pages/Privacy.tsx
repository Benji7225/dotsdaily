import { useLanguage } from '../contexts/LanguageContext';

export default function Privacy() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-black mb-6">{t('privacy.title')}</h1>
      <p className="text-gray-600 mb-8">{t('privacy.lastUpdated')}</p>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('privacy.intro.title')}</h2>
          <p className="leading-relaxed">{t('privacy.intro.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('privacy.dataCollected.title')}</h2>
          <p className="leading-relaxed mb-3">{t('privacy.dataCollected.intro')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('privacy.dataCollected.item1')}</li>
            <li>{t('privacy.dataCollected.item2')}</li>
            <li>{t('privacy.dataCollected.item3')}</li>
            <li>{t('privacy.dataCollected.item4')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('privacy.howWeUse.title')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('privacy.howWeUse.item1')}</li>
            <li>{t('privacy.howWeUse.item2')}</li>
            <li>{t('privacy.howWeUse.item3')}</li>
            <li>{t('privacy.howWeUse.item4')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('privacy.dataStorage.title')}</h2>
          <p className="leading-relaxed">{t('privacy.dataStorage.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('privacy.cookies.title')}</h2>
          <p className="leading-relaxed">{t('privacy.cookies.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('privacy.rights.title')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('privacy.rights.item1')}</li>
            <li>{t('privacy.rights.item2')}</li>
            <li>{t('privacy.rights.item3')}</li>
            <li>{t('privacy.rights.item4')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('privacy.security.title')}</h2>
          <p className="leading-relaxed">{t('privacy.security.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('privacy.changes.title')}</h2>
          <p className="leading-relaxed">{t('privacy.changes.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('privacy.contact.title')}</h2>
          <p className="leading-relaxed">
            {t('privacy.contact.content')} <a href="mailto:hello@dotsdaily.app" className="text-orange-600 hover:text-orange-700 underline">hello@dotsdaily.app</a>
          </p>
        </section>
      </div>
    </div>
  );
}
