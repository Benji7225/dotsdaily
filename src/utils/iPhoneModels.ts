export interface SafeArea {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ModelSpecs {
  width: number;
  height: number;
  safeArea: SafeArea;
}

export type Variant = 'standard' | 'mini' | 'plus' | 'pro' | 'pro-max' | 'xs' | 'xs-max' | 'xr' | 'se';

export interface Generation {
  id: string;
  name: string;
  variants: Partial<Record<Variant, ModelSpecs>>;
}

export const variantLabels: Record<Variant, string> = {
  standard: 'Standard',
  mini: 'mini',
  plus: 'Plus',
  pro: 'Pro',
  'pro-max': 'Pro Max',
  xs: 'XS',
  'xs-max': 'XS Max',
  xr: 'XR',
  se: 'SE',
};

export const iPhoneGenerations: Generation[] = [
  {
    id: '16',
    name: 'iPhone 16',
    variants: {
      standard: {
        width: 393,
        height: 852,
        safeArea: { top: Math.round(852 * 0.40), bottom: Math.round(852 * 0.15), left: Math.round(393 * 0.08), right: Math.round(393 * 0.08) },
      },
      plus: {
        width: 430,
        height: 932,
        safeArea: { top: Math.round(932 * 0.40), bottom: Math.round(932 * 0.15), left: Math.round(430 * 0.08), right: Math.round(430 * 0.08) },
      },
      pro: {
        width: 402,
        height: 874,
        safeArea: { top: Math.round(874 * 0.40), bottom: Math.round(874 * 0.15), left: Math.round(402 * 0.08), right: Math.round(402 * 0.08) },
      },
      'pro-max': {
        width: 430,
        height: 932,
        safeArea: { top: Math.round(932 * 0.40), bottom: Math.round(932 * 0.15), left: Math.round(430 * 0.08), right: Math.round(430 * 0.08) },
      },
    },
  },
  {
    id: '15',
    name: 'iPhone 15',
    variants: {
      standard: {
        width: 393,
        height: 852,
        safeArea: { top: Math.round(852 * 0.40), bottom: Math.round(852 * 0.15), left: Math.round(393 * 0.08), right: Math.round(393 * 0.08) },
      },
      plus: {
        width: 430,
        height: 932,
        safeArea: { top: Math.round(932 * 0.40), bottom: Math.round(932 * 0.15), left: Math.round(430 * 0.08), right: Math.round(430 * 0.08) },
      },
      pro: {
        width: 393,
        height: 852,
        safeArea: { top: Math.round(852 * 0.40), bottom: Math.round(852 * 0.15), left: Math.round(393 * 0.08), right: Math.round(393 * 0.08) },
      },
      'pro-max': {
        width: 430,
        height: 932,
        safeArea: { top: Math.round(932 * 0.40), bottom: Math.round(932 * 0.15), left: Math.round(430 * 0.08), right: Math.round(430 * 0.08) },
      },
    },
  },
  {
    id: '14',
    name: 'iPhone 14',
    variants: {
      standard: {
        width: 390,
        height: 844,
        safeArea: { top: Math.round(844 * 0.40), bottom: Math.round(844 * 0.15), left: Math.round(390 * 0.08), right: Math.round(390 * 0.08) },
      },
      plus: {
        width: 428,
        height: 926,
        safeArea: { top: Math.round(926 * 0.40), bottom: Math.round(926 * 0.15), left: Math.round(428 * 0.08), right: Math.round(428 * 0.08) },
      },
      pro: {
        width: 393,
        height: 852,
        safeArea: { top: Math.round(852 * 0.40), bottom: Math.round(852 * 0.15), left: Math.round(393 * 0.08), right: Math.round(393 * 0.08) },
      },
      'pro-max': {
        width: 430,
        height: 932,
        safeArea: { top: Math.round(932 * 0.40), bottom: Math.round(932 * 0.15), left: Math.round(430 * 0.08), right: Math.round(430 * 0.08) },
      },
    },
  },
  {
    id: '13',
    name: 'iPhone 13',
    variants: {
      mini: {
        width: 375,
        height: 812,
        safeArea: { top: Math.round(812 * 0.40), bottom: Math.round(812 * 0.15), left: Math.round(375 * 0.08), right: Math.round(375 * 0.08) },
      },
      standard: {
        width: 390,
        height: 844,
        safeArea: { top: Math.round(844 * 0.40), bottom: Math.round(844 * 0.15), left: Math.round(390 * 0.08), right: Math.round(390 * 0.08) },
      },
      pro: {
        width: 390,
        height: 844,
        safeArea: { top: Math.round(844 * 0.40), bottom: Math.round(844 * 0.15), left: Math.round(390 * 0.08), right: Math.round(390 * 0.08) },
      },
      'pro-max': {
        width: 428,
        height: 926,
        safeArea: { top: Math.round(926 * 0.40), bottom: Math.round(926 * 0.15), left: Math.round(428 * 0.08), right: Math.round(428 * 0.08) },
      },
    },
  },
  {
    id: '12',
    name: 'iPhone 12',
    variants: {
      mini: {
        width: 375,
        height: 812,
        safeArea: { top: Math.round(812 * 0.40), bottom: Math.round(812 * 0.15), left: Math.round(375 * 0.08), right: Math.round(375 * 0.08) },
      },
      standard: {
        width: 390,
        height: 844,
        safeArea: { top: Math.round(844 * 0.40), bottom: Math.round(844 * 0.15), left: Math.round(390 * 0.08), right: Math.round(390 * 0.08) },
      },
      pro: {
        width: 390,
        height: 844,
        safeArea: { top: Math.round(844 * 0.40), bottom: Math.round(844 * 0.15), left: Math.round(390 * 0.08), right: Math.round(390 * 0.08) },
      },
      'pro-max': {
        width: 428,
        height: 926,
        safeArea: { top: Math.round(926 * 0.40), bottom: Math.round(926 * 0.15), left: Math.round(428 * 0.08), right: Math.round(428 * 0.08) },
      },
    },
  },
  {
    id: '11',
    name: 'iPhone 11',
    variants: {
      standard: {
        width: 414,
        height: 896,
        safeArea: { top: Math.round(896 * 0.40), bottom: Math.round(896 * 0.15), left: Math.round(414 * 0.08), right: Math.round(414 * 0.08) },
      },
      pro: {
        width: 375,
        height: 812,
        safeArea: { top: Math.round(812 * 0.40), bottom: Math.round(812 * 0.15), left: Math.round(375 * 0.08), right: Math.round(375 * 0.08) },
      },
      'pro-max': {
        width: 414,
        height: 896,
        safeArea: { top: Math.round(896 * 0.40), bottom: Math.round(896 * 0.15), left: Math.round(414 * 0.08), right: Math.round(414 * 0.08) },
      },
    },
  },
  {
    id: 'x',
    name: 'iPhone X',
    variants: {
      standard: {
        width: 375,
        height: 812,
        safeArea: { top: Math.round(812 * 0.40), bottom: Math.round(812 * 0.15), left: Math.round(375 * 0.08), right: Math.round(375 * 0.08) },
      },
      xr: {
        width: 414,
        height: 896,
        safeArea: { top: Math.round(896 * 0.40), bottom: Math.round(896 * 0.15), left: Math.round(414 * 0.08), right: Math.round(414 * 0.08) },
      },
      xs: {
        width: 375,
        height: 812,
        safeArea: { top: Math.round(812 * 0.40), bottom: Math.round(812 * 0.15), left: Math.round(375 * 0.08), right: Math.round(375 * 0.08) },
      },
      'xs-max': {
        width: 414,
        height: 896,
        safeArea: { top: Math.round(896 * 0.40), bottom: Math.round(896 * 0.15), left: Math.round(414 * 0.08), right: Math.round(414 * 0.08) },
      },
    },
  },
  {
    id: 'se3',
    name: 'iPhone SE',
    variants: {
      se: {
        width: 375,
        height: 667,
        safeArea: { top: Math.round(667 * 0.40), bottom: Math.round(667 * 0.15), left: Math.round(375 * 0.08), right: Math.round(375 * 0.08) },
      },
    },
  },
  {
    id: '8',
    name: 'iPhone 8',
    variants: {
      standard: {
        width: 375,
        height: 667,
        safeArea: { top: Math.round(667 * 0.40), bottom: Math.round(667 * 0.15), left: Math.round(375 * 0.08), right: Math.round(375 * 0.08) },
      },
      plus: {
        width: 414,
        height: 736,
        safeArea: { top: Math.round(736 * 0.40), bottom: Math.round(736 * 0.15), left: Math.round(414 * 0.08), right: Math.round(414 * 0.08) },
      },
    },
  },
  {
    id: '7',
    name: 'iPhone 7',
    variants: {
      standard: {
        width: 375,
        height: 667,
        safeArea: { top: Math.round(667 * 0.40), bottom: Math.round(667 * 0.15), left: Math.round(375 * 0.08), right: Math.round(375 * 0.08) },
      },
      plus: {
        width: 414,
        height: 736,
        safeArea: { top: Math.round(736 * 0.40), bottom: Math.round(736 * 0.15), left: Math.round(414 * 0.08), right: Math.round(414 * 0.08) },
      },
    },
  },
  {
    id: '6s',
    name: 'iPhone 6s',
    variants: {
      standard: {
        width: 375,
        height: 667,
        safeArea: { top: Math.round(667 * 0.40), bottom: Math.round(667 * 0.15), left: Math.round(375 * 0.08), right: Math.round(375 * 0.08) },
      },
      plus: {
        width: 414,
        height: 736,
        safeArea: { top: Math.round(736 * 0.40), bottom: Math.round(736 * 0.15), left: Math.round(414 * 0.08), right: Math.round(414 * 0.08) },
      },
    },
  },
  {
    id: '6',
    name: 'iPhone 6',
    variants: {
      standard: {
        width: 375,
        height: 667,
        safeArea: { top: Math.round(667 * 0.40), bottom: Math.round(667 * 0.15), left: Math.round(375 * 0.08), right: Math.round(375 * 0.08) },
      },
      plus: {
        width: 414,
        height: 736,
        safeArea: { top: Math.round(736 * 0.40), bottom: Math.round(736 * 0.15), left: Math.round(414 * 0.08), right: Math.round(414 * 0.08) },
      },
    },
  },
];

export function getModelSpecs(generationId: string, variant: Variant): ModelSpecs | null {
  const generation = iPhoneGenerations.find(g => g.id === generationId);
  if (!generation) return null;
  return generation.variants[variant] || null;
}

export function getAvailableVariants(generationId: string): Variant[] {
  const generation = iPhoneGenerations.find(g => g.id === generationId);
  if (!generation) return [];
  return Object.keys(generation.variants) as Variant[];
}

export function getDefaultVariant(generationId: string): Variant | null {
  const variants = getAvailableVariants(generationId);
  return variants.length > 0 ? variants[0] : null;
}

export const defaultGeneration = iPhoneGenerations[0];
export const defaultVariant: Variant = 'pro-max';
