export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  currencySymbol: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1SttrTRKdgKcjnf73kGOlaZo',
    name: 'Lifetime Premium',
    description: 'Get lifetime access to all premium features including custom themes, shapes, and advanced display options.',
    mode: 'payment',
    price: 2.99,
    currency: 'eur',
    currencySymbol: '€'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};