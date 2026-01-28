import { useState, useEffect } from 'react';
import { Calendar, Heart, Target, Copy, Check, LogIn, Crown, History, X } from 'lucide-react';
import WallpaperPreview from '../components/WallpaperPreview';
import ConfigPanel from '../components/ConfigPanel';
import { defaultGeneration, defaultVariant, Variant, getModelSpecs } from '../utils/iPhoneModels';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useSavedConfigs } from '../hooks/useSavedConfigs';
import { Link } from 'react-router-dom';

export type WallpaperMode = 'year' | 'life' | 'countdown';
export type Granularity = 'day' | 'week' | 'month' | 'year';
export type Grouping = 'none' | 'week' | 'month' | 'quarter' | 'year';
export type ThemeType = 'dark' | 'light' | 'custom' | 'image';
export type DotShape = 'circle' | 'square' | 'heart';
export type AdditionalDisplay = 'percentage' | 'timeRemaining' | 'none';

export interface WallpaperConfig {
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
}

export default function Generator() {
  const { t, language } = useLanguage();
  const { user, session, signInWithGoogle } = useAuth();
  const { isPremium } = useSubscription();
  const { configs: savedConfigs, loading: loadingConfigs } = useSavedConfigs();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showSavedConfigsModal, setShowSavedConfigsModal] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [config, setConfig] = useState<WallpaperConfig>({
    mode: 'year',
    granularity: 'day',
    grouping: 'month',
    theme: 'dark',
    themeType: 'dark',
    generation: defaultGeneration.id,
    variant: defaultVariant,
    birthDate: '2000-01-26',
    lifeExpectancy: 80,
    startDate: '2026-01-26',
    targetDate: '2026-02-09',
  });

  const [copied, setCopied] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const hasSuccess = url.searchParams.has('success');
    const hasCanceled = url.searchParams.has('canceled');

    const savedConfig = localStorage.getItem('pendingConfig');
    if (savedConfig && (hasSuccess || hasCanceled)) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        localStorage.removeItem('pendingConfig');

        url.searchParams.delete('success');
        url.searchParams.delete('canceled');
        window.history.replaceState({}, '', url.toString());
      } catch (error) {
        console.error('Error restoring config:', error);
        localStorage.removeItem('pendingConfig');
      }
    }
  }, []);

  useEffect(() => {
    setShortUrl('');
  }, [config]);

  const getDefaultGranularity = (mode: WallpaperMode): Granularity => {
    switch (mode) {
      case 'year': return 'day';
      case 'life': return 'year';
      case 'countdown': return 'day';
    }
  };

  const getDefaultGrouping = (mode: WallpaperMode): Grouping => {
    return mode === 'year' ? 'month' : 'none';
  };

  const handleModeChange = (newMode: WallpaperMode) => {
    setConfig({
      ...config,
      mode: newMode,
      granularity: getDefaultGranularity(newMode),
      grouping: getDefaultGrouping(newMode)
    });
  };

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
        const svgContent = generateSVG(config, modelSpecs, translations);

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
  }, [config, modelSpecs, t]);

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

    if (usesPremiumFeatures() && !isPremium) {
      setShowPremiumModal(true);
      return;
    }

    if (!modelSpecs) return;

    setIsGenerating(true);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const payload = {
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
        throw new Error('Sauvegarde config échouée');
      }

      const saveData = await saveResponse.json();
      const configId = saveData.id;

      const baseUrl = window.location.origin;
      const pngUrl = `${baseUrl}/w/${configId}`;
      setShortUrl(pngUrl);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération du fond d\'écran');
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

  const handleUpgradeToPremium = async () => {
    if (!session) {
      localStorage.setItem('pendingConfig', JSON.stringify(config));
      await signInWithGoogle();
      return;
    }

    setLoadingCheckout(true);

    try {
      localStorage.setItem('pendingConfig', JSON.stringify(config));

      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete('success');
      currentUrl.searchParams.delete('canceled');
      const returnUrl = currentUrl.toString();

      const response = await fetch(`${apiUrl}/functions/v1/create-checkout`, {
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
      localStorage.removeItem('pendingConfig');
    } finally {
      setLoadingCheckout(false);
    }
  };

  const modes = [
    { id: 'year' as WallpaperMode, name: t('generator.modes.year.name'), icon: Calendar, desc: t('generator.modes.year.desc') },
    { id: 'life' as WallpaperMode, name: t('generator.modes.life.name'), icon: Heart, desc: t('generator.modes.life.desc') },
    { id: 'countdown' as WallpaperMode, name: t('generator.modes.goal.name'), icon: Target, desc: t('generator.modes.goal.desc') },
  ];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-4xl mx-auto">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={`p-4 sm:p-6 rounded-xl transition-all border-2 ${
                config.mode === mode.id
                  ? 'bg-orange-500 text-white border-orange-500 shadow-lg'
                  : 'bg-white text-black border-gray-200 hover:border-orange-500'
              }`}
            >
              <mode.icon className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 mx-auto" />
              <h3 className="text-base sm:text-lg font-semibold mb-1">{mode.name}</h3>
              <p className={`text-xs sm:text-sm ${config.mode === mode.id ? 'text-orange-100' : 'text-gray-500'}`}>
                {mode.desc}
              </p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 lg:gap-6 max-w-6xl mx-auto items-start">
          <div className="order-2 lg:order-1">
            <ConfigPanel config={config} setConfig={setConfig} onShowPremiumModal={() => setShowPremiumModal(true)} />

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-black mb-4">
                Fonctionnalités Premium
              </h3>
              <div className="text-3xl font-bold text-orange-500 mb-6">
                2,99€ à vie
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Texte personnalisé sur le fond d'écran</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Groupement par trimestre</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Couleurs personnalisées avec pipette</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Couleur des points personnalisable</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Formes de points (cercle, carré, cœur)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Support prioritaire</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleUpgradeToPremium}
              disabled={loadingCheckout}
              className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingCheckout ? 'Chargement...' : 'Paiement'}
            </button>
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
