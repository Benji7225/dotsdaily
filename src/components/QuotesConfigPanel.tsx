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
        setConfig({ ...config, backgroundImage: result });
      };
      reader.readAsDataURL(file);
    }
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

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Background
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setConfig({ ...config, theme: 'dark', themeType: 'dark', backgroundImage: undefined })}
              className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                config.themeType === 'dark' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setConfig({ ...config, theme: 'light', themeType: 'light', backgroundImage: undefined })}
              className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                config.themeType === 'light' ? 'border-slate-900 bg-slate-100 text-slate-900' : 'border-slate-200 bg-white text-slate-900'
              }`}
            >
              Light
            </button>
          </div>
          <div className="mt-3">
            <label className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 border-slate-200 cursor-pointer hover:border-slate-900 transition-colors bg-white">
              <Upload className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-medium text-slate-700">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
            {config.backgroundImage && (
              <div className="mt-2 relative inline-block">
                <img src={config.backgroundImage} alt="Background" className="h-20 rounded-lg" />
                <button
                  onClick={() => setConfig({ ...config, backgroundImage: undefined })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Dot Color
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="color"
                value={config.dotColor || '#FF8C42'}
                onChange={(e) => setConfig({ ...config, dotColor: e.target.value })}
                className="w-full h-12 rounded-lg cursor-pointer border-2 border-slate-200"
              />
            </div>
            <button
              onClick={() => setConfig({ ...config, dotColor: '#FF8C42' })}
              className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Dot Shape
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setConfig({ ...config, dotShape: 'circle' })}
              className={`py-3 px-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                (config.dotShape || 'circle') === 'circle' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white'
              }`}
            >
              <Circle className="w-5 h-5" />
              <span className="text-sm font-medium">Circle</span>
            </button>
            <button
              onClick={() => setConfig({ ...config, dotShape: 'square' })}
              className={`py-3 px-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                config.dotShape === 'square' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white'
              }`}
            >
              <Square className="w-5 h-5" />
              <span className="text-sm font-medium">Square</span>
            </button>
            <button
              onClick={() => setConfig({ ...config, dotShape: 'heart' })}
              className={`py-3 px-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                config.dotShape === 'heart' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium">Heart</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Text Color
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setConfig({ ...config, quoteTextColor: 'white' })}
              className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                (config.quoteTextColor || 'white') === 'white' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
              }`}
            >
              White
            </button>
            <button
              onClick={() => setConfig({ ...config, quoteTextColor: 'black' })}
              className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                config.quoteTextColor === 'black' ? 'border-slate-900 bg-slate-100 text-slate-900' : 'border-slate-200 bg-white text-slate-900'
              }`}
            >
              Black
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { shortQuotes };
