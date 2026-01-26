import { useLanguage } from '../contexts/LanguageContext';

export default function Legal() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-black mb-6">{t('legal.title')}</h1>
      <p className="text-gray-600 mb-8">{t('legal.subtitle')}</p>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('legal.publisher.title')}</h2>
          <div className="space-y-2">
            <p><strong>{t('legal.publisher.name')}:</strong> DotsDaily</p>
            <p><strong>{t('legal.publisher.email')}:</strong> contact@dotsdaily.app</p>
            <p><strong>{t('legal.publisher.website')}:</strong> https://dotsdaily.app</p>
          </div>
        </section>

        <section>
          
          <h2 className="text-2xl font-semibold text-black mb-4">{t('legal.hosting.title')}</h2>

          <div className="space-y-2">
            <p><strong>{t('legal.hosting.provider')}:</strong> Vercel Inc.</p>
            <p><strong>{t('legal.hosting.address')}:</strong> 440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
            <p><strong>{t('legal.hosting.website')}:</strong> https://vercel.com</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('legal.database.title')}</h2>
          <div className="space-y-2">
            <p><strong>{t('legal.database.provider')}:</strong> Supabase Inc.</p>
            <p><strong>{t('legal.database.website')}:</strong> https://supabase.com</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('legal.intellectual.title')}</h2>
          <p className="leading-relaxed">{t('legal.intellectual.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('legal.personal.title')}</h2>
          <p className="leading-relaxed">{t('legal.personal.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('legal.cookies.title')}</h2>
          <p className="leading-relaxed">{t('legal.cookies.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">{t('legal.applicable.title')}</h2>
          <p className="leading-relaxed">{t('legal.applicable.content')}</p>
        </section>
      </div>
    </div>
  );
}
