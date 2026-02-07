import { WallpaperConfig, QuoteMode, DotShape } from '../pages/Generator';
import { iPhoneGenerations, getAvailableVariants, variantLabels, Variant, getDefaultVariant } from '../utils/iPhoneModels';
import { Pipette, Upload, X, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface QuotesConfigPanelProps {
  config: WallpaperConfig;
  setConfig: (config: WallpaperConfig) => void;
}

const quoteCategories = {
  discipline: {
    label: 'Discipline',
    examples: ['do it anyway.', 'no excuses.', 'stay consistent.', 'discipline > mood.']
  },
  self_respect: {
    label: 'Self Respect',
    examples: ['respect yourself.', 'protect your peace.', 'raise your standards.', 'keep boundaries.']
  },
  confidence: {
    label: 'Confidence',
    examples: ['i am capable.', 'i trust myself.', 'i will win.', 'watch me.']
  },
  calm: {
    label: 'Anxiety / Calm',
    examples: ['breathe.', 'you are safe.', 'stay present.', 'it will pass.']
  },
  heartbreak: {
    label: 'Heartbreak / Moving On',
    examples: ['let them go.', 'choose peace.', 'heal quietly.', 'new chapter.']
  },
  love: {
    label: 'Love',
    examples: ['i love you.', 'i\'m proud of you.', 'you\'re my home.', 'i choose you.']
  },
  ambition: {
    label: 'Money / Ambition',
    examples: ['build the life.', 'think bigger.', 'stay hungry.', 'execute.']
  },
  gym: {
    label: 'Gym / Grind',
    examples: ['one more rep.', 'earn the body.', 'no days off.', 'stay hard.']
  },
  focus: {
    label: 'Study / Focus',
    examples: ['focus.', 'lock in.', 'deep work.', 'finish this.']
  },
  memento_mori: {
    label: 'Memento Mori / Time',
    examples: ['time is running.', 'life is short.', 'make it count.', 'stop delaying.']
  }
};

const shortQuotes: string[] = [];

export default function QuotesConfigPanel({ config, setConfig }: QuotesConfigPanelProps) {
  const [imageError, setImageError] = useState<string | null>(null);
  const [availableVariants, setAvailableVariants] = useState<Variant[]>([]);
  const [showCategoryExamples, setShowCategoryExamples] = useState<string | null>(null);
  const [customQuotesText, setCustomQuotesText] = useState('');

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

  const handleCategoryToggle = (category: string) => {
    const currentCategories = config.quoteCategories || ['discipline'];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    setConfig({ ...config, quoteCategories: newCategories.length > 0 ? newCategories : ['discipline'] });
  };

  const handleCustomQuotesChange = (text: string) => {
    setCustomQuotesText(text);
    const lines = text.split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (trimmed.length > 0 && !trimmed.endsWith('.')) {
          return trimmed + '.';
        }
        return trimmed;
      })
      .filter(line => line.length > 0)
      .slice(0, 100);
    setConfig({ ...config, customQuotes: lines.length > 0 ? lines : undefined });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Set it once</h3>

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
            <option value="custom">Custom Quotes</option>
          </select>
        </div>

        {config.quoteMode === 'short' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quote Categories
            </label>
            <p className="mb-3 text-xs text-slate-500">Select one or more categories. Your wallpaper will rotate through quotes from selected categories daily.</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(quoteCategories).map(([key, category]) => {
                const currentCategories = config.quoteCategories || ['discipline'];
                const isSelected = currentCategories.includes(key);
                return (
                  <div key={key} className="relative">
                    <button
                      onClick={() => handleCategoryToggle(key)}
                      className={`pl-3 pr-8 py-1.5 rounded-full text-sm font-medium transition-all relative ${
                        isSelected
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {category.label}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCategoryExamples(showCategoryExamples === key ? null : key);
                        }}
                        className={`absolute top-1/2 right-2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors rounded-full ${
                          isSelected ? 'hover:bg-orange-600' : 'hover:bg-slate-300'
                        }`}
                        title="Show examples"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </button>
                    {showCategoryExamples === key && (
                      <div className="absolute top-full left-0 mt-1 z-10 bg-white rounded-lg shadow-xl border border-slate-200 p-3 min-w-[200px]">
                        <p className="text-xs font-semibold text-slate-900 mb-2">Examples:</p>
                        <ul className="space-y-1">
                          {category.examples.map((example, idx) => (
                            <li key={idx} className="text-xs text-slate-600">• {example}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {config.quoteMode === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Custom Quotes
            </label>
            <p className="mb-3 text-xs text-slate-500">One quote per line. Max 100 quotes. Your wallpaper will rotate through your custom quotes daily.</p>
            <textarea
              value={customQuotesText}
              onChange={(e) => handleCustomQuotesChange(e.target.value)}
              placeholder="i will do it.&#10;focus.&#10;no excuses."
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors bg-white font-mono text-sm min-h-[150px]"
              maxLength={5000}
            />
            {config.customQuotes && config.customQuotes.length > 0 && (
              <p className="mt-2 text-xs text-slate-700 font-medium">{config.customQuotes.length} quote{config.customQuotes.length !== 1 ? 's' : ''} added</p>
            )}
          </div>
        )}

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
      </div>
    </div>
  );
}

export { shortQuotes };
