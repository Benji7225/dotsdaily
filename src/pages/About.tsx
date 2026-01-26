import { useLanguage } from '../contexts/LanguageContext';
import { Circle, Heart, Sparkles, Users } from 'lucide-react';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-6">{t('about.title')}</h1>
        <p className="text-xl text-gray-600 mb-12">{t('about.subtitle')}</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-2">
              <Circle className="w-6 h-6 text-orange-500 fill-orange-500" />
              {t('about.mission.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">{t('about.mission.content')}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-2">
              <Circle className="w-6 h-6 text-orange-500 fill-orange-500" />
              {t('about.story.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('about.story.content1')}</p>
            <p className="text-gray-700 leading-relaxed">{t('about.story.content2')}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-2">
              <Circle className="w-6 h-6 text-orange-500 fill-orange-500" />
              {t('about.why.title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-black mb-2">{t('about.why.simple.title')}</h3>
                <p className="text-gray-600 text-sm">{t('about.why.simple.content')}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-black mb-2">{t('about.why.effective.title')}</h3>
                <p className="text-gray-600 text-sm">{t('about.why.effective.content')}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-black mb-2">{t('about.why.private.title')}</h3>
                <p className="text-gray-600 text-sm">{t('about.why.private.content')}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-black mb-2">{t('about.why.free.title')}</h3>
                <p className="text-gray-600 text-sm">{t('about.why.free.content')}</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-2">
              <Circle className="w-6 h-6 text-orange-500 fill-orange-500" />
              {t('about.community.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('about.community.content')}</p>
            <p className="text-gray-700 leading-relaxed">
              {t('about.community.contact')} <a href="mailto:contact@dotsdaily.app" className="text-orange-600 hover:text-orange-700 underline">contact@dotsdaily.app</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
