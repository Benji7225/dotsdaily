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

  // Add current date as a template variable that Shortcuts will replace daily
  // Use {{CURRENT_DATE}} as placeholder that user will replace in Shortcuts
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
    date: '{{CURRENT_DATE}}', // This forces cache invalidation each day
  }).toString()}` : '';

  const copyUrl = async () => {
    await navigator.clipboard.writeText(wallpaperUrl);
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
              <div className="bg-slate-50 rounded-lg p-4 mb-4 break-all text-sm text-slate-700 font-mono">
                {wallpaperUrl}
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

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Configuration Apple Raccourcis
                </h4>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Ouvre l'app Raccourcis</li>
                  <li>Crée un nouveau raccourci</li>
                  <li>Ajoute "Obtenir le contenu de l'URL"</li>
                  <li>Colle l'URL ci-dessus, puis remplace <strong>{"{{CURRENT_DATE}}"}</strong> par la variable "Date actuelle" de Shortcuts</li>
                  <li>Ajoute "Convertir" puis sélectionne PNG</li>
                  <li>Ajoute "Définir comme fond d'écran"</li>
                  <li>Configure une automatisation quotidienne (ex: chaque jour à 6h)</li>
                </ol>
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded">
                  <p className="text-xs text-amber-900">
                    <strong>Important :</strong> Remplace {"{{CURRENT_DATE}}"} dans l'URL par la variable magique "Date actuelle" dans Shortcuts. Cela force le téléchargement d'une nouvelle image chaque jour.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <WallpaperPreview url={wallpaperUrl} modelSpecs={modelSpecs} theme={config.theme} generation={config.generation} variant={config.variant} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
