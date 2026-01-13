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

export type Variant = 'standard' | 'mini' | 'plus' | 'pro' | 'pro-max' | 'xs' | 'xs-max' | 'xr';

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
};

export const iPhoneGenerations: Generation[] = [
  {
    id: '16',
    name: 'iPhone 16',
    variants: {
      standard: {
        width: 393,
        height: 852,
        safeArea: { top: 150, bottom: 120, left: 40, right: 40 },
      },
      plus: {
        width: 430,
        height: 932,
        safeArea: { top: 150, bottom: 120, left: 40, right: 40 },
      },
      pro: {
        width: 402,
        height: 874,
        safeArea: { top: 150, bottom: 120, left: 40, right: 40 },
      },
      'pro-max': {
        width: 430,
        height: 932,
        safeArea: { top: 150, bottom: 120, left: 40, right: 40 },
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
        safeArea: { top: 150, bottom: 120, left: 40, right: 40 },
      },
      plus: {
        width: 430,
        height: 932,
        safeArea: { top: 150, bottom: 120, left: 40, right: 40 },
      },
      pro: {
        width: 393,
        height: 852,
        safeArea: { top: 150, bottom: 120, left: 40, right: 40 },
      },
      'pro-max': {
        width: 430,
        height: 932,
        safeArea: { top: 150, bottom: 120, left: 40, right: 40 },
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
        safeArea: { top: 140, bottom: 110, left: 40, right: 40 },
      },
      plus: {
        width: 428,
        height: 926,
        safeArea: { top: 140, bottom: 110, left: 40, right: 40 },
      },
      pro: {
        width: 393,
        height: 852,
        safeArea: { top: 150, bottom: 120, left: 40, right: 40 },
      },
      'pro-max': {
        width: 430,
        height: 932,
        safeArea: { top: 150, bottom: 120, left: 40, right: 40 },
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
        safeArea: { top: 140, bottom: 110, left: 35, right: 35 },
      },
      standard: {
        width: 390,
        height: 844,
        safeArea: { top: 140, bottom: 110, left: 40, right: 40 },
      },
      pro: {
        width: 390,
        height: 844,
        safeArea: { top: 140, bottom: 110, left: 40, right: 40 },
      },
      'pro-max': {
        width: 428,
        height: 926,
        safeArea: { top: 140, bottom: 110, left: 40, right: 40 },
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
        safeArea: { top: 140, bottom: 110, left: 35, right: 35 },
      },
      standard: {
        width: 390,
        height: 844,
        safeArea: { top: 140, bottom: 110, left: 40, right: 40 },
      },
      pro: {
        width: 390,
        height: 844,
        safeArea: { top: 140, bottom: 110, left: 40, right: 40 },
      },
      'pro-max': {
        width: 428,
        height: 926,
        safeArea: { top: 140, bottom: 110, left: 40, right: 40 },
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
        safeArea: { top: 140, bottom: 110, left: 40, right: 40 },
      },
      pro: {
        width: 375,
        height: 812,
        safeArea: { top: 140, bottom: 110, left: 35, right: 35 },
      },
      'pro-max': {
        width: 414,
        height: 896,
        safeArea: { top: 140, bottom: 110, left: 40, right: 40 },
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
        safeArea: { top: 140, bottom: 110, left: 35, right: 35 },
      },
      xr: {
        width: 414,
        height: 896,
        safeArea: { top: 140, bottom: 110, left: 40, right: 40 },
      },
      xs: {
        width: 375,
        height: 812,
        safeArea: { top: 140, bottom: 110, left: 35, right: 35 },
      },
      'xs-max': {
        width: 414,
        height: 896,
        safeArea: { top: 140, bottom: 110, left: 40, right: 40 },
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
