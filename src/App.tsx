import { useState } from 'react';
import { Calendar, Clock, Heart, Target, Copy, Check } from 'lucide-react';
import WallpaperPreview from './components/WallpaperPreview';
import ConfigPanel from './components/ConfigPanel';
import { defaultGeneration, defaultVariant, Variant, getModelSpecs } from './utils/iPhoneModels';

export type WallpaperMode = 'year' | 'month' | 'life' | 'countdown';
export type Granularity = 'day' | 'week' | 'month' | 'year';
export type Grouping = 'none' | 'week' | 'month' | 'quarter' | 'year';

export interface WallpaperConfig {
  mode: WallpaperMode;
  granularity: Granularity;
  grouping: Grouping;
  targetDate?: string;
  startDate?: string;
  birthDate?: string;
  lifeExpectancy?: number;
  theme: 'dark' | 'light';
  generation: string;
  variant: Variant;
}

function App() {
  const [config, setConfig] = useState<WallpaperConfig>({
    mode: 'year',
    granularity: 'day',
    grouping: 'month',
    theme: 'dark',
    generation: defaultGeneration.id,
    variant: defaultVariant,
  });

  const [copied, setCopied] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const getDefaultGranularity = (mode: WallpaperMode): Granularity => {
    switch (mode) {
      case 'year': return 'day';
      case 'month': return 'day';
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
  const wallpaperUrl = modelSpecs ? `${apiUrl}/functions/v1/wallpaper?${new URLSearchParams({
    mode: config.mode,
    granularity: config.granularity,
    grouping: config.grouping,
    theme: config.theme,
    width: modelSpecs.width.toString(),
    height: modelSpecs.height.toString(),
    safeTop: modelSpecs.safeArea.top.toString(),
    safeBottom: modelSpecs.safeArea.bottom.toString(),
    safeLeft: modelSpecs.safeArea.left.toString(),
    safeRight: modelSpecs.safeArea.right.toString(),
    ...(config.targetDate && { target: config.targetDate }),
    ...(config.startDate && { start: config.startDate }),
    ...(config.birthDate && { birth: config.birthDate }),
    ...(config.lifeExpectancy && { life: config.lifeExpectancy.toString() }),
  }).toString()}` : '';

  const generateShortUrl = async () => {
    if (!modelSpecs) return;

    setIsGenerating(true);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const payload = {
        mode: config.mode,
        granularity: config.granularity,
        grouping: config.grouping,
        theme: config.theme,
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

      const response = await fetch(`${apiUrl}/functions/v1/save-wallpaper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to generate short URL');
      }

      const data = await response.json();
      const baseUrl = window.location.hostname === 'localhost'
        ? apiUrl
        : 'https://dotsdaily.app';
      setShortUrl(`${baseUrl}/functions/v1/wallpaper/w/${data.id}`);
    } catch (error) {
      console.error('Error generating short URL:', error);
      alert('Erreur lors de la génération de l\'URL courte');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyUrl = async () => {
    const urlToCopy = shortUrl || wallpaperUrl;
    await navigator.clipboard.writeText(urlToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modes = [
    { id: 'year' as WallpaperMode, name: 'Année', icon: Calendar, desc: 'Progression dans l\'année' },
    { id: 'month' as WallpaperMode, name: 'Mois', icon: Clock, desc: 'Progression dans le mois' },
    { id: 'life' as WallpaperMode, name: 'Vie', icon: Heart, desc: 'Progression dans la vie' },
    { id: 'countdown' as WallpaperMode, name: 'Objectif', icon: Target, desc: 'Compte à rebours vers un objectif' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-3">
            Calendrier Visuel
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Génère un fond d'écran dynamique qui visualise ta progression dans le temps
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={`p-6 rounded-2xl transition-all transform hover:scale-105 ${
                config.mode === mode.id
                  ? 'bg-slate-900 text-white shadow-2xl'
                  : 'bg-white text-slate-900 shadow-lg hover:shadow-xl'
              }`}
            >
              <mode.icon className="w-8 h-8 mb-3 mx-auto" />
              <h3 className="text-lg font-semibold mb-1">{mode.name}</h3>
              <p className={`text-sm ${config.mode === mode.id ? 'text-slate-300' : 'text-slate-500'}`}>
                {mode.desc}
              </p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ConfigPanel config={config} setConfig={setConfig} />

            <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                URL pour Apple Raccourcis
              </h3>

              {!shortUrl ? (
                <>
                  <button
                    onClick={generateShortUrl}
                    disabled={isGenerating}
                    className="w-full bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed mb-4"
                  >
                    {isGenerating ? 'Génération...' : 'Générer l\'URL courte'}
                  </button>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">
                      Cliquez pour générer une URL courte et facile à utiliser avec Apple Raccourcis. L'image sera automatiquement mise à jour chaque jour à minuit dans votre fuseau horaire.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-slate-50 rounded-lg p-4 mb-4 break-all text-sm text-slate-700 font-mono">
                    {shortUrl}
                  </div>
                  <button
                    onClick={copyUrl}
                    className="w-full bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copier l'URL
                      </>
                    )}
                  </button>
                </>
              )}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Configuration Apple Raccourcis
                </h4>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Ouvre l'app Raccourcis sur ton iPhone</li>
                  <li>Crée un nouveau raccourci</li>
                  <li>Ajoute l'action "Obtenir le contenu de l'URL"</li>
                  <li>Colle l'URL générée ci-dessus</li>
                  <li>Ajoute l'action "Définir comme fond d'écran"</li>
                  <li>Configure une automatisation quotidienne après minuit</li>
                </ol>
                <p className="text-xs text-blue-700 mt-3">
                  Le fond d'écran se mettra à jour automatiquement chaque jour à minuit dans ton fuseau horaire.
                </p>
              </div>
            </div>
          </div>

          <div>
            <WallpaperPreview url={shortUrl || wallpaperUrl} modelSpecs={modelSpecs} theme={config.theme} generation={config.generation} variant={config.variant} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
