import { Link } from 'react-router-dom';
import { Calendar, Heart, Target, Zap, Smartphone, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-12 sm:pt-20 pb-16 sm:pb-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-black mb-4 sm:mb-6 leading-tight whitespace-pre-line">
              {t('home.hero.title')}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-10 px-4">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/generator"
                className="bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-orange-600 transition-colors inline-block"
              >
                {t('home.hero.cta')}
              </Link>
              <a
                href="#how-it-works"
                className="bg-white text-black border-2 border-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-50 transition-colors inline-block"
              >
                {t('home.hero.learn')}
              </a>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 md:p-12 shadow-lg">
            <img
              src="/dotsdaily_logo.webp"
              alt="DotsDaily wallpaper example"
              className="w-full max-w-md mx-auto rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section id="features" className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black text-center mb-12 sm:mb-16">
            {t('home.features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{t('home.features.noApp.title')}</h3>
              <p className="text-gray-600">
                {t('home.features.noApp.desc')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{t('home.features.autoUpdate.title')}</h3>
              <p className="text-gray-600">
                {t('home.features.autoUpdate.desc')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{t('home.features.custom.title')}</h3>
              <p className="text-gray-600">
                {t('home.features.custom.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black text-center mb-12 sm:mb-16">
            {t('home.modes.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 sm:p-8">
              <div className="bg-orange-500 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-3">{t('home.modes.year.title')}</h3>
              <p className="text-gray-600">
                {t('home.modes.year.desc')}
              </p>
            </div>

            <div className="text-center p-6 sm:p-8">
              <div className="bg-orange-500 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-3">{t('home.modes.life.title')}</h3>
              <p className="text-gray-600">
                {t('home.modes.life.desc')}
              </p>
            </div>

            <div className="text-center p-6 sm:p-8">
              <div className="bg-orange-500 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-3">{t('home.modes.goal.title')}</h3>
              <p className="text-gray-600">
                {t('home.modes.goal.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black text-center mb-12 sm:mb-16">
            {t('home.howItWorks.title')}
          </h2>
          <div className="space-y-6 sm:space-y-8">
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">{t('home.howItWorks.step1.title')}</h3>
                <p className="text-gray-600">
                  {t('home.howItWorks.step1.desc')}
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">{t('home.howItWorks.step2.title')}</h3>
                <p className="text-gray-600">
                  {t('home.howItWorks.step2.desc')}
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">{t('home.howItWorks.step3.title')}</h3>
                <p className="text-gray-600">
                  {t('home.howItWorks.step3.desc')}
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">{t('home.howItWorks.step4.title')}</h3>
                <p className="text-gray-600">
                  {t('home.howItWorks.step4.desc')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <Link
              to="/generator"
              className="bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-orange-600 transition-colors inline-block"
            >
              {t('home.howItWorks.cta')}
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="py-12 sm:py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black text-center mb-12 sm:mb-16">
            {t('home.faq.title')}
          </h2>
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-black mb-2">{t('home.faq.q1.q')}</h3>
              <p className="text-sm sm:text-base text-gray-600">
                {t('home.faq.q1.a')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-black mb-2">{t('home.faq.q2.q')}</h3>
              <p className="text-sm sm:text-base text-gray-600">
                {t('home.faq.q2.a')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-black mb-2">{t('home.faq.q3.q')}</h3>
              <p className="text-sm sm:text-base text-gray-600">
                {t('home.faq.q3.a')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-black mb-2">{t('home.faq.q4.q')}</h3>
              <p className="text-sm sm:text-base text-gray-600">
                {t('home.faq.q4.a')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-black mb-2">{t('home.faq.q5.q')}</h3>
              <p className="text-sm sm:text-base text-gray-600">
                {t('home.faq.q5.a')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-orange-500">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-lg sm:text-xl text-orange-100 mb-8 sm:mb-10 px-4">
            {t('home.cta.subtitle')}
          </p>
          <Link
            to="/generator"
            className="bg-white text-orange-500 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-50 transition-colors inline-block"
          >
            {t('home.cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
}
