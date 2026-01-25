import { useState, useEffect } from 'react';
import { Calendar, Heart, Target, Copy, Check } from 'lucide-react';
import WallpaperPreview from './components/WallpaperPreview';
import ConfigPanel from './components/ConfigPanel';
import { defaultGeneration, defaultVariant, Variant, getModelSpecs } from './utils/iPhoneModels';

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
  customText?: string;
  generation: string;
  variant: Variant;
}

function App() {
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
        console.log('Génération preview commencée');
        const { generateSVG } = await import('./utils/svgGenerator');
        const svgContent = generateSVG(config, modelSpecs);
        console.log('SVG généré, longueur:', svgContent.length);

        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);

        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = (e) => {
            console.error('Erreur chargement image SVG:', e);
            reject(e);
          };
          img.src = svgUrl;
        });

        console.log('Image SVG chargée');

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

        console.log('Blob PNG créé, taille:', pngBlob.size);

        if (!cancelled) {
          const pngUrl = URL.createObjectURL(pngBlob);
          currentPreviewUrl = pngUrl;
          console.log('Preview URL créée:', pngUrl);
          setPreviewUrl(pngUrl);
        }
      } catch (error) {
        console.error('Erreur génération aperçu:', error);
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
        themeType: config.themeType,
        customColor: config.customColor,
        backgroundImage: config.backgroundImage,
        dotColor: config.dotColor,
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

  const modes = [
    { id: 'year' as WallpaperMode, name: 'Année', icon: Calendar, desc: 'Progression dans l\'année' },
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

              <div className="flex gap-3 mb-4">
                <button
                  onClick={generateShortUrl}
                  disabled={isGenerating}
                  className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Génération...' : shortUrl ? 'Régénérer l\'URL' : 'Générer l\'URL'}
                </button>
                {shortUrl && (
                  <button
                    onClick={copyUrl}
                    className="px-6 py-3 rounded-lg font-semibold border-2 border-slate-900 text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copier
                      </>
                    )}
                  </button>
                )}
              </div>

              {shortUrl ? (
                <div className="bg-slate-50 rounded-lg p-4 mb-4 break-all text-sm text-slate-700 font-mono">
                  {shortUrl}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-lg mb-4">
                  <p className="text-sm text-slate-600">
                    Cliquez pour générer une URL courte et facile à utiliser avec Apple Raccourcis. L'image sera automatiquement mise à jour chaque jour à minuit dans votre fuseau horaire.
                  </p>
                </div>
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
            <WallpaperPreview url={shortUrl || previewUrl} modelSpecs={modelSpecs} theme={config.theme} generation={config.generation} variant={config.variant} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
