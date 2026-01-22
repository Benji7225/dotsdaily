import { WallpaperConfig, WallpaperMode, Granularity, Grouping, ThemeType } from '../pages/Create';
import { iPhoneGenerations, getAvailableVariants, variantLabels, Variant, getDefaultVariant } from '../utils/iPhoneModels';
import { Pipette, Upload } from 'lucide-react';

interface ConfigPanelProps {
  config: WallpaperConfig;
  setConfig: (config: WallpaperConfig) => void;
}

const granularityOptions: Record<WallpaperMode, { value: Granularity; label: string }[]> = {
  year: [
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

  const handleThemeChange = (themeType: ThemeType, customColor?: string, backgroundImage?: string) => {
    const isDark = themeType === 'dark' || (themeType === 'custom' && customColor && isColorDark(customColor));
    setConfig({
      ...config,
      themeType,
      theme: isDark ? 'dark' : 'light',
      customColor,
      backgroundImage,
    });
  };

  const isColorDark = (color: string): boolean => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleThemeChange('image', undefined, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleThemeChange('custom', e.target.value);
  };

  const handleDotColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, dotColor: e.target.value });
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
            Fond d'écran
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleThemeChange('dark')}
              className={`w-12 h-12 rounded-full bg-black border-4 transition-all ${
                config.themeType === 'dark'
                  ? 'border-slate-900 shadow-lg scale-110'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              title="Fond noir"
            />
            <button
              onClick={() => handleThemeChange('light')}
              className={`w-12 h-12 rounded-full bg-white border-4 transition-all ${
                config.themeType === 'light'
                  ? 'border-slate-900 shadow-lg scale-110'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              title="Fond blanc"
            />
            <label
              className={`w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center cursor-pointer ${
                config.themeType === 'custom'
                  ? 'border-slate-900 shadow-lg scale-110'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              style={{
                backgroundColor: config.themeType === 'custom' ? config.customColor : '#888888'
              }}
              title="Couleur personnalisée"
            >
              {config.themeType !== 'custom' && (
                <Pipette className="w-5 h-5 text-white" />
              )}
              <input
                type="color"
                value={config.customColor || '#888888'}
                onChange={handleBgColorChange}
                className="w-0 h-0 opacity-0 absolute"
              />
            </label>
            <label
              className={`w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center cursor-pointer ${
                config.themeType === 'image'
                  ? 'border-slate-900 shadow-lg scale-110'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              style={{
                backgroundImage: config.themeType === 'image' && config.backgroundImage
                  ? `url(${config.backgroundImage})`
                  : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: config.themeType === 'image' ? 'transparent' : '#666666'
              }}
              title="Image personnalisée"
            >
              {config.themeType !== 'image' && (
                <Upload className="w-5 h-5 text-white" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Couleur des points
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setConfig({ ...config, dotColor: undefined })}
              className={`w-12 h-12 rounded-full bg-orange-500 border-4 transition-all ${
                !config.dotColor
                  ? 'border-slate-900 shadow-lg scale-110'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              title="Orange (par défaut)"
            />
            <label
              className={`w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center cursor-pointer ${
                config.dotColor
                  ? 'border-slate-900 shadow-lg scale-110'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              style={{
                backgroundColor: config.dotColor || '#888888'
              }}
              title="Couleur personnalisée"
            >
              {!config.dotColor && (
                <Pipette className="w-5 h-5 text-white" />
              )}
              <input
                type="color"
                value={config.dotColor || '#f97316'}
                onChange={handleDotColorChange}
                className="w-0 h-0 opacity-0 absolute"
              />
            </label>
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
      </div>
    </div>
  );
}
