import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import WallpaperPreview from '../components/WallpaperPreview';
import ConfigPanel from '../components/ConfigPanel';
import { defaultGeneration, defaultVariant, Variant, getModelSpecs } from '../utils/iPhoneModels';

export type WallpaperMode = 'year' | 'life' | 'countdown';
export type Granularity = 'day' | 'week' | 'month' | 'year';
export type Grouping = 'none' | 'week' | 'month' | 'quarter' | 'year';
export type ThemeType = 'dark' | 'light' | 'custom' | 'image';

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
  generation: string;
  variant: Variant;
}

export default function Create() {
  const [config, setConfig] = useState<WallpaperConfig>({
    mode: 'year',
    granularity: 'day',
    grouping: 'month',
    theme: 'dark',
    themeType: 'dark',
    generation: defaultGeneration.id,
    variant: defaultVariant,
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
      case 'life': return 'week';
      case 'countdown': return 'day';
    }
  };

  const getDefaultGrouping = (mode: WallpaperMode, granularity?: Granularity): Grouping => {
    if (mode === 'year') {
      const gran = granularity || 'day';
      if (gran === 'day') return 'month';
      if (gran === 'week') return 'quarter';
      return 'none';
    }
    return 'none';
  };

  const handleModeChange = (newMode: WallpaperMode) => {
    const newGranularity = getDefaultGranularity(newMode);
    const newGrouping = getDefaultGrouping(newMode, newGranularity);

    setConfig({
      ...config,
      mode: newMode,
      granularity: newGranularity,
      grouping: newGrouping,
      targetDate: newMode === 'countdown' ? undefined : config.targetDate,
      birthDate: newMode === 'life' ? undefined : config.birthDate,
    });
  };

  const handleGranularityChange = (newGranularity: Granularity) => {
    const newGrouping = getDefaultGrouping(config.mode, newGranularity);
    setConfig({
      ...config,
      granularity: newGranularity,
      grouping: newGrouping,
    });
  };

  const apiUrl = import.meta.env.VITE_SUPABASE_URL;

  const generateWallpaper = async () => {
    if (config.mode === 'life' && !config.birthDate) {
      alert('Veuillez entrer votre date de naissance pour le mode "Vie"');
      return;
    }

    if (config.mode === 'countdown' && (!config.targetDate || !config.startDate)) {
      alert('Veuillez entrer les dates de début et de fin pour le mode "Compte à rebours"');
      return;
    }

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
        },
        body: JSON.stringify(payload),
      });

      if (!saveResponse.ok) {
        throw new Error('Erreur lors de la génération du lien');
      }

      const { id } = await saveResponse.json();
      const generatedUrl = `${window.location.origin}/wallpaper/${id}`;
      setShortUrl(generatedUrl);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la génération du lien');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const modelSpecs = getModelSpecs(config.generation, config.variant);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Créez Votre Fond d'Écran
          </h1>
          <p className="text-lg text-slate-600">
            Personnalisez votre fond d'écran et générez un lien unique qui se met à jour automatiquement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ConfigPanel
            config={config}
            setConfig={setConfig}
            onModeChange={handleModeChange}
            onGranularityChange={handleGranularityChange}
          />
          <WallpaperPreview config={config} />
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={generateWallpaper}
            disabled={isGenerating}
            className="bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Génération en cours...' : 'Générer le Lien'}
          </button>

          {shortUrl && (
            <div className="mt-6 max-w-2xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Votre fond d'écran est prêt !
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shortUrl}
                    readOnly
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copié
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copier
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-slate-600 mt-4">
                  Ouvrez ce lien sur votre iPhone, appuyez longuement sur l'image et sélectionnez "Ajouter à Photos" ou "Définir comme fond d'écran".
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
