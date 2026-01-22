import { WallpaperConfig, WallpaperMode, Granularity, Grouping } from '../App';
import { iPhoneGenerations, getAvailableVariants, variantLabels, Variant, getDefaultVariant } from '../utils/iPhoneModels';

interface ConfigPanelProps {
  config: WallpaperConfig;
  setConfig: (config: WallpaperConfig) => void;
}

const granularityOptions: Record<WallpaperMode, { value: Granularity; label: string }[]> = {
  year: [
    { value: 'day', label: 'Jour' },
    { value: 'week', label: 'Semaine' },
  ],
  month: [
    { value: 'day', label: 'Jour' },
    { value: 'week', label: 'Semaine' },
  ],
  life: [
    { value: 'year', label: 'Année' },
    { value: 'month', label: 'Mois' },
    { value: 'week', label: 'Semaine' },
  ],
  countdown: [
    { value: 'day', label: 'Jour' },
    { value: 'week', label: 'Semaine' },
    { value: 'month', label: 'Mois' },
    { value: 'year', label: 'Année' },
  ],
};

const groupingOptions: Record<WallpaperMode, { value: Grouping; label: string }[]> = {
  year: [
    { value: 'none', label: 'Aucun' },
    { value: 'month', label: 'Mois' },
    { value: 'quarter', label: 'Trimestre' },
  ],
  month: [],
  life: [],
  countdown: [],
};

export default function ConfigPanel({ config, setConfig }: ConfigPanelProps) {
  const today = new Date().toISOString().split('T')[0];
  const availableVariants = getAvailableVariants(config.generation);
  const availableGranularities = granularityOptions[config.mode];
  let availableGroupings = groupingOptions[config.mode];

  if (config.mode === 'year' && config.granularity === 'week') {
    availableGroupings = availableGroupings.filter(g => g.value !== 'month');
  }

  const handleGenerationChange = (generationId: string) => {
    const defaultVariant = getDefaultVariant(generationId);
    if (defaultVariant) {
      setConfig({ ...config, generation: generationId, variant: defaultVariant });
    }
  };

  const handleVariantChange = (variant: Variant) => {
    setConfig({ ...config, variant });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Configuration</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Modèle d'iPhone
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <select
                value={config.generation}
                onChange={(e) => handleGenerationChange(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors bg-white"
              >
                {iPhoneGenerations.map((gen) => (
                  <option key={gen.id} value={gen.id}>
                    {gen.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={config.variant}
                onChange={(e) => handleVariantChange(e.target.value as Variant)}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors bg-white"
              >
                {availableVariants.map((variant) => (
                  <option key={variant} value={variant}>
                    {variantLabels[variant]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Thème
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setConfig({ ...config, theme: 'dark' })}
              className={`p-3 rounded-lg border-2 transition-all ${
                config.theme === 'dark'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              Sombre
            </button>
            <button
              onClick={() => setConfig({ ...config, theme: 'light' })}
              className={`p-3 rounded-lg border-2 transition-all ${
                config.theme === 'light'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              Clair
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {availableGroupings.length > 0 ? 'Points et affichage' : 'Points'}
          </label>
          <div className={availableGroupings.length > 0 ? 'grid grid-cols-2 gap-3' : ''}>
            <div>
              <select
                value={config.granularity}
                onChange={(e) => {
                  const newGranularity = e.target.value as Granularity;
                  const newConfig = { ...config, granularity: newGranularity };
                  if (config.mode === 'year' && newGranularity === 'week' && config.grouping === 'month') {
                    newConfig.grouping = 'none';
                  }
                  setConfig(newConfig);
                }}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors bg-white"
              >
                {availableGranularities.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {availableGroupings.length > 0 && (
              <div>
                <select
                  value={config.grouping}
                  onChange={(e) => setConfig({ ...config, grouping: e.target.value as Grouping })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors bg-white"
                >
                  {availableGroupings.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {config.mode === 'life' && (
          <>
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-slate-700 mb-2">
                Date de naissance
              </label>
              <input
                id="birthDate"
                type="date"
                max={today}
                value={config.birthDate || ''}
                onChange={(e) => setConfig({ ...config, birthDate: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="lifeExpectancy" className="block text-sm font-medium text-slate-700 mb-2">
                Espérance de vie (années)
              </label>
              <input
                id="lifeExpectancy"
                type="number"
                min="1"
                max="120"
                value={config.lifeExpectancy || 80}
                onChange={(e) => setConfig({ ...config, lifeExpectancy: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors"
              />
            </div>
          </>
        )}

        {config.mode === 'countdown' && (
          <>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-2">
                Date de début
              </label>
              <input
                id="startDate"
                type="date"
                max={today}
                value={config.startDate || today}
                onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-slate-700 mb-2">
                Date cible
              </label>
              <input
                id="targetDate"
                type="date"
                min={config.startDate || today}
                value={config.targetDate || ''}
                onChange={(e) => setConfig({ ...config, targetDate: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors"
              />
            </div>
          </>
        )}

        {config.mode === 'year' && (
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">
              Affiche la progression dans l'année en cours avec la granularité choisie.
            </p>
          </div>
        )}

        {config.mode === 'month' && (
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">
              Affiche la progression dans le mois en cours avec la granularité choisie.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
