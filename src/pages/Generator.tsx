import { useState, useEffect } from 'react';
import { Calendar, Heart, Target, Copy, Check, LogIn, Crown } from 'lucide-react';
import WallpaperPreview from '../components/WallpaperPreview';
import ConfigPanel from '../components/ConfigPanel';
import { defaultGeneration, defaultVariant, Variant, getModelSpecs } from '../utils/iPhoneModels';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { Link } from 'react-router-dom';

export type WallpaperMode = 'year' | 'life' | 'countdown';
export type Granularity = 'day' | 'week' | 'month' | 'year';
export type Grouping = 'none' | 'week' | 'month' | 'quarter' | 'year';
export type ThemeType = 'dark' | 'light' | 'custom' | 'image';
export type DotShape = 'circle' | 'square' | 'heart';

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
  generation: string;
  variant: Variant;
}

export default function Generator() {
  const { t } = useLanguage();
  const { user, session, signInWithGoogle } = useAuth();
  const { isPremium } = useSubscription();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
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
        const svgContent = generateSVG(config, modelSpecs);

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
  }, [config, modelSpecs]);

  const usesPremiumFeatures = () => {
    return (
      config.themeType === 'custom' ||
      config.dotColor !== undefined ||
      (config.customText && config.customText.length > 0) ||
      config.grouping === 'quarter' ||
      (config.dotShape && config.dotShape !== 'circle')
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
      };

      const saveResponse = await fetch(`${apiUrl}/functions/v1/save-wallpaper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
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

  const copyUrl = async () => {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpgradeToPremium = async () => {
    if (!session) {
      await signInWithGoogle();
      return;
    }

    setLoadingCheckout(true);
    try {
      const response = await fetch(`${apiUrl}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
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
      setLoadingCheckout(false);
      setShowPremiumModal(false);
    }
  };

  const modes = [
    { id: 'year' as WallpaperMode, name: t('generator.modes.year.name'), icon: Calendar, desc: t('generator.modes.year.desc') },
    { id: 'life' as WallpaperMode, name: t('generator.modes.life.name'), icon: Heart, desc: t('generator.modes.life.desc') },
    { id: 'countdown' as WallpaperMode, name: t('generator.modes.goal.name'), icon: Target, desc: t('generator.modes.goal.desc') },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-3">
            {t('generator.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('generator.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={`p-6 rounded-xl transition-all border-2 ${
                config.mode === mode.id
                  ? 'bg-orange-500 text-white border-orange-500 shadow-lg'
                  : 'bg-white text-black border-gray-200 hover:border-orange-500'
              }`}
            >
              <mode.icon className="w-8 h-8 mb-3 mx-auto" />
              <h3 className="text-lg font-semibold mb-1">{mode.name}</h3>
              <p className={`text-sm ${config.mode === mode.id ? 'text-orange-100' : 'text-gray-500'}`}>
                {mode.desc}
              </p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 lg:gap-6 max-w-6xl mx-auto items-start">
          <div className="order-2 lg:order-1">
            <ConfigPanel config={config} setConfig={setConfig} onShowPremiumModal={() => setShowPremiumModal(true)} />

            <div className="bg-white border-2 border-gray-100 rounded-xl p-6 mt-6">
              <h3 className="text-lg font-semibold text-black mb-4">
                {t('generator.url.title')}
              </h3>

              <div className="flex gap-3 mb-4">
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
                        {t('generator.url.copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        {t('generator.url.copy')}
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
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">
                Fonctionnalité Premium
              </h3>
              <p className="text-gray-600">
                Cette fonctionnalité nécessite un abonnement Premium. Débloquez toutes les fonctionnalités pour 2,99€/mois.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleUpgradeToPremium}
                disabled={loadingCheckout}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Crown className="w-5 h-5" />
                {loadingCheckout ? 'Chargement...' : 'Passer à Premium'}
              </button>

              <Link
                to="/pricing"
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                Voir les Tarifs
              </Link>

              <button
                onClick={() => setShowPremiumModal(false)}
                className="w-full bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-200"
              >
                {t('auth.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
