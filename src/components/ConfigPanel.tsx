import { WallpaperConfig, WallpaperMode, Granularity, Grouping, ThemeType, DotShape, AdditionalDisplay } from '../pages/Generator';
import { iPhoneGenerations, getAvailableVariants, variantLabels, Variant, getDefaultVariant } from '../utils/iPhoneModels';
import { Upload, Lock, Circle, Square, Heart, Percent, Clock, X, Crown } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';

interface ConfigPanelProps {
  config: WallpaperConfig;
  setConfig: (config: WallpaperConfig) => void;
  onShowPremiumModal: () => void;
  onUpgradeToPremium: () => void;
}

export default function ConfigPanel({ config, setConfig, onShowPremiumModal, onUpgradeToPremium }: ConfigPanelProps) {
  const { isPremium } = useSubscription();
  const { t } = useLanguage();
  const [imageError, setImageError] = useState<string | null>(null);

  const granularityOptions: Record<WallpaperMode, { value: Granularity; label: string }[]> = {
    year: [
      { value: 'day', label: t('config.granularity.day') },
      { value: 'week', label: t('config.granularity.week') },
    ],
    life: [
      { value: 'year', label: t('config.granularity.year') },
      { value: 'month', label: t('config.granularity.month') },
      { value: 'week', label: t('config.granularity.week') },
    ],
    countdown: [
      { value: 'day', label: t('config.granularity.day') },
      { value: 'week', label: t('config.granularity.week') },
      { value: 'month', label: t('config.granularity.month') },
      { value: 'year', label: t('config.granularity.year') },
    ],
  };

  const groupingOptions: Record<WallpaperMode, { value: Grouping; label: string }[]> = {
    year: [
      { value: 'none', label: t('config.grouping.none') },
      { value: 'month', label: t('config.grouping.month') },
      { value: 'quarter', label: t('config.grouping.quarter') },
    ],
    life: [],
    countdown: [],
  };
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
    if (!file) return;

    setImageError(null);

    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      setImageError(t('config.imageErrors.tooLarge'));
      e.target.value = '';
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setImageError(t('config.imageErrors.invalidFormat'));
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (result.length > 4 * 1024 * 1024) {
        setImageError(t('config.imageErrors.dataTooLarge'));
        e.target.value = '';
        return;
      }
      setImageError(null);
      handleThemeChange('image', undefined, result);
    };
    reader.onerror = () => {
      setImageError(t('config.imageErrors.readError'));
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleThemeChange('custom', e.target.value);
  };

  const handleDotColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, dotColor: e.target.value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">{t('config.title')}</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('config.iphoneModel')}
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

        <div className={availableGroupings.length > 0 ? 'grid grid-cols-2 gap-3' : ''}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('config.dots')}
            </label>
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('config.group')}
              </label>
              <div className="relative">
                <select
                  value={config.grouping}
                  onChange={(e) => setConfig({ ...config, grouping: e.target.value as Grouping })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors bg-white"
                >
                  {availableGroupings.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}{option.value === 'quarter' && !isPremium ? ' 🔒' : ''}
                    </option>
                  ))}
                </select>
                {!isPremium && config.grouping === 'quarter' && (
                  <div className="absolute top-1/2 right-10 -translate-y-1/2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg pointer-events-none">
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              {t('config.background')}
              {!isPremium && config.themeType === 'custom' && (
                <span className="flex items-center gap-1 text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3" />
                  {t('config.premium')}
                </span>
              )}
            </label>
            {imageError && (
              <div className="mb-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-red-700">{imageError}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleThemeChange('dark')}
                className={`w-12 h-12 rounded-full bg-black border-4 transition-all ${
                  config.themeType === 'dark'
                    ? 'border-slate-900 shadow-lg scale-110'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                title={t('config.blackBackground')}
              />
              <button
                onClick={() => handleThemeChange('light')}
                className={`w-12 h-12 rounded-full bg-white border-4 transition-all ${
                  config.themeType === 'light'
                    ? 'border-slate-900 shadow-lg scale-110'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                title={t('config.whiteBackground')}
              />
              <label
                className={`w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center cursor-pointer relative ${
                  config.themeType === 'custom'
                    ? 'border-slate-900 shadow-lg scale-110'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                style={{
                  backgroundColor: config.themeType === 'custom' ? config.customColor : '#888888'
                }}
                title={t('config.customColor')}
              >
                {!isPremium && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                )}
                {config.themeType !== 'custom' && (
                  <div className="w-8 h-8 rounded-full" style={{ background: 'conic-gradient(from 0deg, red, yellow, lime, cyan, blue, magenta, red)' }} />
                )}
                <input
                  type="color"
                  value={config.customColor || '#888888'}
                  onChange={handleBgColorChange}
                  className="w-0 h-0 opacity-0 absolute"
                />
              </label>
              <label
                className={`relative w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center cursor-pointer ${
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
                title={t('config.customImage')}
              >
                {!isPremium && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-lg z-10">
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                )}
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
            <p className="mt-2 text-xs text-slate-500">{t('config.imageMaxSize')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              {t('config.dotColor')}
              {!isPremium && config.dotColor && (
                <span className="flex items-center gap-1 text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3" />
                  {t('config.premium')}
                </span>
              )}
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setConfig({ ...config, dotColor: undefined })}
                className={`w-12 h-12 rounded-full bg-orange-500 border-4 transition-all ${
                  !config.dotColor
                    ? 'border-slate-900 shadow-lg scale-110'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                title={t('config.orangeDefault')}
              />
              <label
                className={`w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center cursor-pointer relative ${
                  config.dotColor
                    ? 'border-slate-900 shadow-lg scale-110'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                style={{
                  backgroundColor: config.dotColor || '#888888'
                }}
                title="Couleur personnalisée"
              >
                {!isPremium && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                )}
                {!config.dotColor && (
                  <div className="w-8 h-8 rounded-full" style={{ background: 'conic-gradient(from 0deg, red, yellow, lime, cyan, blue, magenta, red)' }} />
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
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('config.shape')}
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setConfig({ ...config, dotShape: 'circle' })}
              className={`w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center ${
                (!config.dotShape || config.dotShape === 'circle')
                  ? 'border-slate-900 shadow-lg scale-110 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              title={t('config.circle')}
            >
              <Circle className="w-6 h-6 text-slate-700" fill="currentColor" />
            </button>
            <button
              onClick={() => setConfig({ ...config, dotShape: 'square' })}
              className={`w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center relative ${
                config.dotShape === 'square'
                  ? 'border-slate-900 shadow-lg scale-110 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              title={t('config.square')}
            >
              {!isPremium && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Lock className="w-3 h-3 text-white" />
                </div>
              )}
              <Square className="w-6 h-6 text-slate-700" fill="currentColor" />
            </button>
            <button
              onClick={() => setConfig({ ...config, dotShape: 'heart' })}
              className={`w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center relative ${
                config.dotShape === 'heart'
                  ? 'border-slate-900 shadow-lg scale-110 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              title={t('config.heart')}
            >
              {!isPremium && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Lock className="w-3 h-3 text-white" />
                </div>
              )}
              <Heart className="w-6 h-6 text-slate-700" fill="currentColor" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label htmlFor="customText" className="block text-sm font-medium text-slate-700 mb-2">
              {t('config.customText')}
            </label>
            <div className="relative">
              <input
                id="customText"
                type="text"
                maxLength={20}
                placeholder="Ex: 2026"
                value={config.customText || ''}
                onChange={(e) => setConfig({ ...config, customText: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors"
              />
              {!isPremium && (
                <div className="absolute top-1/2 right-3 -translate-y-1/2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Lock className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('config.additionalDisplay')}
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfig({ ...config, additionalDisplay: 'percentage' })}
                className={`flex-1 px-2 sm:px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-1 sm:gap-2 ${
                  (!config.additionalDisplay || config.additionalDisplay === 'percentage')
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
                title={t('config.showPercentage')}
              >
                <Percent className="w-4 h-4" />
                
              </button>

              <button
                onClick={() => setConfig({ ...config, additionalDisplay: 'timeRemaining' })}
                className={`relative flex-1 px-2 sm:px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-1 sm:gap-2 ${
                  config.additionalDisplay === 'timeRemaining'
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
                title={t('config.timeRemaining')}
              >
                {!isPremium && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                )}
                <Clock className="w-4 h-4" />
               
              </button>

              <button
                onClick={() => setConfig({ ...config, additionalDisplay: 'none' })}
                className={`flex-1 px-2 sm:px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-1 sm:gap-2 ${
                  config.additionalDisplay === 'none'
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
                title={t('config.noDisplay')}
              >

                <span className="text-xs sm:text-sm">{t('config.nothing')}</span>
              </button>
            </div>
          </div>
        </div>

        {config.mode === 'life' && (
          <>
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-slate-700 mb-2">
                {t('config.birthDate')}
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
                {t('config.lifeExpectancy')}
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
                {t('config.startDate')}
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
                {t('config.targetDate')}
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

        {!isPremium && (
          <button
            onClick={onUpgradeToPremium}
            className="relative w-full overflow-hidden group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
            <div className="relative flex items-center justify-center gap-3">
              <Crown className="w-5 h-5 animate-pulse" />
              <span className="text-base">Débloquer Premium - 2,99€ à vie</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
