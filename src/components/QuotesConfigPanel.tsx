import { WallpaperConfig, QuoteMode, DotShape } from '../pages/Generator';
import { iPhoneGenerations, getAvailableVariants, variantLabels, Variant, getDefaultVariant } from '../utils/iPhoneModels';
import { Circle, Square, Heart, Pipette, Upload, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface QuotesConfigPanelProps {
  config: WallpaperConfig;
  setConfig: (config: WallpaperConfig) => void;
}

const shortQuotes = [
  "no one will do it for you.",
  "this month will be my month.",
  "do what makes you happy.",
  "you will win.",
  "never give up.",
  "i will be the person i want to be.",
  "it's not just a dream.",
  "be the good person.",
  "better.",
  "balance is not found, it's created.",
  "easy choices -> hard life\nhard choices -> easy life.",
  "focus.",
  "obsession beat talent.",
  "the 1%.",
  "you vs you.",
  "on a mission.",
  "don't quit.",
  "just do it.",
  "patience.",
  "persévérance.",
  "love the process.",
  "discipline.",
  "believe in progress, not in perfection.",
  "no risk, no story.",
  "keep going.",
  "loser not try.",
  "better than yesterday.",
  "my potential is outside my comfort zone.",
  "dreaming doing.",
  "fall 6 times, stand up 7."
];

export default function QuotesConfigPanel({ config, setConfig }: QuotesConfigPanelProps) {
  const [imageError, setImageError] = useState<string | null>(null);
  const [availableVariants, setAvailableVariants] = useState<Variant[]>([]);

  useEffect(() => {
    const variants = getAvailableVariants(config.generation);
    setAvailableVariants(variants);
    if (!variants.includes(config.variant)) {
      setConfig({ ...config, variant: getDefaultVariant(config.generation) });
    }
  }, [config.generation]);

  const handleGenerationChange = (generationId: string) => {
    const variants = getAvailableVariants(generationId);
    const newVariant = getDefaultVariant(generationId);
    setConfig({
      ...config,
      generation: generationId,
      variant: newVariant,
    });
  };

  const handleVariantChange = (variant: Variant) => {
    setConfig({ ...config, variant });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setImageError('Please upload a valid image');
        return;
      }
      setImageError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setConfig({ ...config, backgroundImage: result, themeType: 'image' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThemeChange = (themeType: 'dark' | 'light') => {
    setConfig({
      ...config,
      theme: themeType,
      themeType,
      backgroundImage: undefined,
      customColor: undefined
    });
  };

  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      customColor: e.target.value,
      themeType: 'custom',
      backgroundImage: undefined
    });
  };

  const handleDotColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, dotColor: e.target.value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Customize your Quotes Wallpaper</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            iPhone Model
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
            Quote Mode
          </label>
          <select
            value={config.quoteMode || 'short'}
            onChange={(e) => setConfig({ ...config, quoteMode: e.target.value as QuoteMode })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors bg-white"
          >
            <option value="short">Short Quotes</option>
            <option value="star">Star Quotes</option>
            <option value="custom">Custom Quotes (up to 100)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Background
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
                title="Black Background"
              />
              <button
                onClick={() => handleThemeChange('light')}
                className={`w-12 h-12 rounded-full bg-white border-4 transition-all ${
                  config.themeType === 'light'
                    ? 'border-slate-900 shadow-lg scale-110'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                title="White Background"
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
                title="Custom Color"
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
                title="Custom Image"
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
            <p className="mt-2 text-xs text-slate-500">Max 3 MB</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Dot color
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setConfig({ ...config, dotColor: undefined })}
                className={`w-12 h-12 rounded-full bg-orange-500 border-4 transition-all ${
                  !config.dotColor
                    ? 'border-slate-900 shadow-lg scale-110'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                title="Orange (default)"
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
                title="Custom color"
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
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Shape
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setConfig({ ...config, dotShape: 'circle' })}
              className={`w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center ${
                (!config.dotShape || config.dotShape === 'circle')
                  ? 'border-slate-900 shadow-lg scale-110 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              title="Circle"
            >
              <Circle className="w-6 h-6 text-slate-700" fill="currentColor" />
            </button>
            <button
              onClick={() => setConfig({ ...config, dotShape: 'square' })}
              className={`w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center ${
                config.dotShape === 'square'
                  ? 'border-slate-900 shadow-lg scale-110 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              title="Square"
            >
              <Square className="w-6 h-6 text-slate-700" fill="currentColor" />
            </button>
            <button
              onClick={() => setConfig({ ...config, dotShape: 'heart' })}
              className={`w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center ${
                config.dotShape === 'heart'
                  ? 'border-slate-900 shadow-lg scale-110 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              title="Heart"
            >
              <Heart className="w-6 h-6 text-slate-700" fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { shortQuotes };
