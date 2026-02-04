import { useState, useEffect } from 'react';
import { Calendar, Heart, Target, Copy, Check, LogIn, History, X, ChevronLeft, ChevronRight } from 'lucide-react';
import WallpaperPreview from '../components/WallpaperPreview';
import ConfigPanel from '../components/ConfigPanel';
import QuotesConfigPanel from '../components/QuotesConfigPanel';
import { defaultGeneration, defaultVariant, Variant, getModelSpecs } from '../utils/iPhoneModels';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useSavedConfigs } from '../hooks/useSavedConfigs';
import { Link } from 'react-router-dom';

export type WallpaperType = 'dots' | 'quotes';
export type WallpaperMode = 'year' | 'life' | 'countdown';
export type Granularity = 'day' | 'week' | 'month' | 'year';
export type Grouping = 'none' | 'week' | 'month' | 'quarter' | 'year';
export type ThemeType = 'dark' | 'light' | 'custom' | 'image';
export type DotShape = 'circle' | 'square' | 'heart';
export type AdditionalDisplay = 'percentage' | 'timeRemaining' | 'none';
export type QuoteMode = 'short' | 'star' | 'custom';

export interface WallpaperConfig {
  wallpaperType: WallpaperType;
  mode: WallpaperMode;
  granularity: Granularity;
  grouping: Grouping;
  targetDate?: string;
  startDate?: string;
  birthDate?: string;
  lifeExpectancy?: number;
  theme: 'dark' | 'light';
  themeType: ThemeType;
  customColor?: string;
  backgroundImage?: string;
  dotColor?: string;
  dotShape?: DotShape;
  customText?: string;
  additionalDisplay?: AdditionalDisplay;
  generation: string;
  variant: Variant;
  quoteMode?: QuoteMode;
  customQuotes?: string[];
  quoteTextColor?: 'black' | 'white';
}

export default function Generator() {
  const { t, language } = useLanguage();
  const { user, session, signInWithGoogle } = useAuth();
  const { isPremium } = useSubscription();
  const { configs: savedConfigs, loading: loadingConfigs } = useSavedConfigs();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showSavedConfigsModal, setShowSavedConfigsModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [config, setConfig] = useState<WallpaperConfig>({
    wallpaperType: 'dots',
    mode: 'year',
    granularity: 'day',
    grouping: 'none',
    theme: 'dark',
    themeType: 'dark',
    generation: defaultGeneration.id,
    variant: defaultVariant,
    birthDate: '2000-01-26',
    lifeExpectancy: 80,
    startDate: '2026-01-26',
    targetDate: '2026-02-09',
    quoteMode: 'short',
    quoteTextColor: 'white',
  });

  const [copied, setCopied] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDayOffset, setCurrentDayOffset] = useState(0);

  const handleConfigChange = async (newConfig: WallpaperConfig) => {
    if (!user) {
      localStorage.setItem('pendingConfig', JSON.stringify(newConfig));
      await signInWithGoogle();
      return;
    }
    setConfig(newConfig);
  };

  useEffect(() => {
    const savedConfig = localStorage.getItem('pendingConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        localStorage.removeItem('pendingConfig');
      } catch (error) {
        console.error('Error restoring config:', error);
        localStorage.removeItem('pendingConfig');
      }
    }

    const url = new URL(window.location.href);
    if (url.searchParams.has('success') || url.searchParams.has('canceled')) {
      url.searchParams.delete('success');
      url.searchParams.delete('canceled');
      url.hash = '';
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  useEffect(() => {
    setShortUrl('');
  }, [config]);

  const modelSpecs = getModelSpecs(config.generation, config.variant);
  const apiUrl = import.meta.env.VITE_SUPABASE_URL;
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (!modelSpecs) return;

    let cancelled = false;
    let currentPreviewUrl: string | null = null;

    const generatePreview = async () => {
      try {
        const { generateSVG } = await import('../utils/svgGenerator');
        const translations = {
          months: t('wallpaper.months'),
          quarters: t('wallpaper.quarters'),
          timeRemaining: {
            days: t('wallpaper.timeRemaining.days'),
            weeks: t('wallpaper.timeRemaining.weeks'),
            months: t('wallpaper.timeRemaining.months'),
            years: t('wallpaper.timeRemaining.years')
          }
        };
        const svgContent = generateSVG(config, modelSpecs, translations, currentDayOffset);

        if (cancelled) return;

        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);

        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = svgUrl;
        });

        if (cancelled) {
          URL.revokeObjectURL(svgUrl);
          return;
        }

        const scale = 3;
        const canvas = document.createElement('canvas');
        canvas.width = modelSpecs.width * scale;
        canvas.height = modelSpecs.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas non disponible');

        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(svgUrl);

        const pngBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Conversion PNG échouée'));
          }, 'image/png');
        });

        if (!cancelled) {
          setPreviewUrl(oldUrl => {
            if (oldUrl && oldUrl.startsWith('blob:')) {
              URL.revokeObjectURL(oldUrl);
            }
            currentPreviewUrl = URL.createObjectURL(pngBlob);
            return currentPreviewUrl;
          });
        }
      } catch (error) {
        console.error('Erreur génération aperçu:', error);
        if (!cancelled) {
          setPreviewUrl('');
        }
      }
    };

    generatePreview();

    return () => {
      cancelled = true;
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl);
      }
    };
  }, [config, modelSpecs, t, currentDayOffset]);

  const usesPremiumFeatures = () => {
    return (
      config.themeType === 'custom' ||
      config.themeType === 'image' ||
      config.dotColor !== undefined ||
      (config.customText && config.customText.length > 0) ||
      config.grouping === 'quarter' ||
      (config.dotShape && config.dotShape !== 'circle') ||
      config.additionalDisplay === 'timeRemaining'
    );
  };

  const generateShortUrl = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }

    if (!modelSpecs) return;

    setIsGenerating(true);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const payload = {
        wallpaperType: config.wallpaperType,
        mode: config.mode,
        granularity: config.granularity,
        grouping: config.grouping,
        theme: config.theme,
        themeType: config.themeType,
        customColor: config.customColor,
        backgroundImage: config.backgroundImage,
        dotColor: config.dotColor,
        dotShape: config.dotShape,
        customText: config.customText,
        additionalDisplay: config.additionalDisplay,
        targetDate: config.targetDate,
        startDate: config.startDate,
        birthDate: config.birthDate,
        lifeExpectancy: config.lifeExpectancy,
        width: modelSpecs.width,
        height: modelSpecs.height,
        safeTop: modelSpecs.safeArea.top,
        safeBottom: modelSpecs.safeArea.bottom,
        safeLeft: modelSpecs.safeArea.left,
        safeRight: modelSpecs.safeArea.right,
        timezone,
        language: language,
        quoteMode: config.quoteMode,
        quoteTextColor: config.quoteTextColor,
        customQuotes: config.customQuotes,
      };

      const saveResponse = await fetch(`${apiUrl}/functions/v1/save-wallpaper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Edge function error:', errorData);
        throw new Error(`Sauvegarde config échouée: ${errorData.error || saveResponse.statusText}`);
      }

      const saveData = await saveResponse.json();
      const configId = saveData.id;

      const baseUrl = window.location.origin;
      const pngUrl = `${baseUrl}/w/${configId}`;
      setShortUrl(pngUrl);
    } catch (error) {
      console.error('Erreur complète:', error);
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur lors de la génération du fond d\'écran'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const loadSavedConfig = (savedConfig: any) => {
    const generation = defaultGeneration.id;
    const variant = defaultVariant;

    setConfig({
      mode: savedConfig.mode as WallpaperMode,
      granularity: savedConfig.granularity as Granularity,
      grouping: savedConfig.grouping as Grouping,
      theme: savedConfig.theme,
      themeType: savedConfig.theme_type as ThemeType,
      customColor: savedConfig.custom_color,
      backgroundImage: savedConfig.background_image,
      dotColor: savedConfig.dot_color,
      dotShape: savedConfig.dot_shape as DotShape,
      customText: savedConfig.custom_text,
      additionalDisplay: savedConfig.additional_display as AdditionalDisplay,
      targetDate: savedConfig.target_date,
      startDate: savedConfig.start_date,
      birthDate: savedConfig.birth_date,
      lifeExpectancy: savedConfig.life_expectancy,
      generation,
      variant,
    });

    const baseUrl = window.location.origin;
    const pngUrl = `${baseUrl}/w/${savedConfig.id}`;
    setShortUrl(pngUrl);
    setShowSavedConfigsModal(false);
  };

  const copyUrl = async () => {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpgradeToPremium = () => {
    window.location.href = '/pricing';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-3">
            {t('generator.title')}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {t('generator.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 lg:gap-6 max-w-6xl mx-auto items-start">
          <div className="order-2 lg:order-1">
            <div className="bg-white border-2 border-gray-100 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setConfig({ ...config, wallpaperType: 'dots' })}
                  className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
                    config.wallpaperType === 'dots'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Dots Wallpaper
                </button>
                <button
                  onClick={() => setConfig({ ...config, wallpaperType: 'quotes' })}
                  className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
                    config.wallpaperType === 'quotes'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Quotes Wallpaper
                </button>
              </div>
            </div>

            {config.wallpaperType === 'dots' ? (
              <ConfigPanel config={config} setConfig={handleConfigChange} onShowPremiumModal={() => setShowPremiumModal(true)} onUpgradeToPremium={handleUpgradeToPremium} />
            ) : (
              <QuotesConfigPanel config={config} setConfig={handleConfigChange} />
            )}

            <div className="bg-white border-2 border-gray-100 rounded-xl p-4 sm:p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-black">
                  {t('generator.url.title')}
                </h3>
                {user && savedConfigs.length > 0 && (
                  <button
                    onClick={() => setShowSavedConfigsModal(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <History className="w-4 h-4" />
                    <span className="hidden sm:inline">Mes configs</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                  onClick={generateShortUrl}
                  disabled={isGenerating}
                  className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isGenerating ? t('generator.url.generating') : shortUrl ? t('generator.url.regenerate') : t('generator.url.generate')}
                </button>
                {shortUrl && (
                  <button
                    onClick={copyUrl}
                    className="px-6 py-3 rounded-lg font-semibold border-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span className="hidden sm:inline">{t('generator.url.copied')}</span>
                        <span className="sm:hidden">Copié</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span className="hidden sm:inline">{t('generator.url.copy')}</span>
                        <span className="sm:hidden">Copier</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {shortUrl ? (
                <div className="bg-gray-50 rounded-lg p-4 mb-4 break-all text-sm text-gray-700 font-mono">
                  {shortUrl}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg mb-4">
                  <p className="text-sm text-gray-600">
                    {t('generator.url.placeholder')}
                  </p>
                </div>
              )}

              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-black mb-2">
                  {t('generator.url.setup.title')}
                </h4>
                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                  <li>{t('generator.url.setup.step1')}</li>
                  <li>{t('generator.url.setup.step2')}</li>
                  <li>{t('generator.url.setup.step3')}</li>
                  <li>{t('generator.url.setup.step4')}</li>
                  <li>{t('generator.url.setup.step5')}</li>
                  <li>{t('generator.url.setup.step6')}</li>
                  <li>{t('generator.url.setup.step7')}</li>
                </ol>
                <p className="text-xs text-gray-600 mt-3">
                  {t('generator.url.setup.note')}
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:sticky lg:top-4">
            {config.wallpaperType === 'quotes' && (
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={() => setCurrentDayOffset(Math.max(currentDayOffset - 1, -365))}
                  disabled={currentDayOffset <= -365}
                  className="p-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
                  {currentDayOffset === 0 ? 'Today' : `${Math.abs(currentDayOffset)} day${Math.abs(currentDayOffset) > 1 ? 's' : ''} ago`}
                </span>
                <button
                  onClick={() => setCurrentDayOffset(Math.min(currentDayOffset + 1, 0))}
                  disabled={currentDayOffset >= 0}
                  className="p-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
            <WallpaperPreview url={shortUrl || previewUrl} modelSpecs={modelSpecs} theme={config.theme} />
          </div>
        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">
                {t('auth.signInRequired')}
              </h3>
              <p className="text-gray-600">
                {t('auth.signInMessage')}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                  } catch (error) {
                    console.error('Sign in error:', error);
                  }
                }}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                {t('auth.signInButton')}
              </button>

              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                {t('auth.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full relative">
            <button
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                {language === 'fr' ? 'Débloquez DotsDaily' : 'Unlock DotsDaily'}
              </h3>
              <p className="text-gray-600">
                {language === 'fr' ? '3 jours gratuits, puis choisissez votre plan' : '3 days free, then choose your plan'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`border-2 rounded-xl p-4 transition-all text-left ${
                  selectedPlan === 'monthly'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm text-gray-600 mb-1">{language === 'fr' ? 'Mensuel' : 'Monthly'}</div>
                <div className="text-3xl font-bold text-black mb-2">$2.99<span className="text-lg text-gray-600">/mo</span></div>
                <div className="text-xs text-gray-500">{language === 'fr' ? 'Annulez à tout moment' : 'Cancel anytime'}</div>
              </button>

              <button
                onClick={() => setSelectedPlan('annual')}
                className={`border-2 rounded-xl p-4 transition-all text-left relative ${
                  selectedPlan === 'annual'
                    ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {language === 'fr' ? '-44%' : 'Save 44%'}
                </div>
                <div className="text-sm text-orange-700 mb-1">{language === 'fr' ? 'Annuel' : 'Annual'}</div>
                <div className="text-3xl font-bold text-black mb-2">$19.9<span className="text-lg text-gray-600">/yr</span></div>
                <div className="text-xs text-orange-700">{language === 'fr' ? 'Meilleure offre' : 'Best value'}</div>
              </button>
            </div>

            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{language === 'fr' ? 'Fond d\'écran qui se met à jour chaque jour' : 'Auto-updating wallpaper every day'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{language === 'fr' ? 'Personnalisation complète (couleurs, formes, texte)' : 'Full customization (colors, shapes, text)'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{language === 'fr' ? 'Tous les modèles iPhone supportés' : 'All iPhone models supported'}</span>
              </li>
            </ul>

            <button
              onClick={() => window.location.href = selectedPlan === 'monthly'
                ? 'https://buy.stripe.com/eVq14pcvT5LE9xbexDfMA04'
                : 'https://buy.stripe.com/fZufZjdzXb5Y24J0GNfMA05'
              }
              className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              {language === 'fr' ? 'Payer' : 'Pay Now'}
            </button>

            <p className="text-center text-xs text-gray-500 mt-3">
              {language === 'fr' ? 'Essayez gratuitement pendant 3 jours. Aucune carte requise.' : 'Try free for 3 days. No card required.'}
            </p>
          </div>
        </div>
      )}

      {showSavedConfigsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-black">
                Mes configurations sauvegardées
              </h3>
              <button
                onClick={() => setShowSavedConfigsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {loadingConfigs ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Chargement...</p>
              </div>
            ) : savedConfigs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Aucune configuration sauvegardée</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedConfigs.map((savedConfig) => {
                  const modeLabels: Record<string, string> = {
                    year: 'Année',
                    life: 'Vie',
                    countdown: 'Compte à rebours',
                  };
                  const date = new Date(savedConfig.created_at);
                  const formattedDate = date.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  });

                  return (
                    <button
                      key={savedConfig.id}
                      onClick={() => loadSavedConfig(savedConfig)}
                      className="w-full p-4 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors text-left border-2 border-transparent hover:border-orange-200"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-black">
                              {modeLabels[savedConfig.mode] || savedConfig.mode}
                            </span>
                            <span className="text-xs text-gray-500">
                              {savedConfig.granularity}
                            </span>
                            {savedConfig.custom_text && (
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                                Texte perso
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Créé le {formattedDate}
                          </p>
                        </div>
                        <div className="text-sm text-orange-500 font-medium">
                          Charger
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
