import React from 'react';
import { PricingCard } from './PricingCard';
import { stripeProducts } from '../../stripe-config';

export function PricingSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get lifetime access to all premium features with a single purchase. 
            No subscriptions, no hidden fees.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="max-w-md">
            {stripeProducts.map((product) => (
              <PricingCard 
                key={product.priceId} 
                product={product} 
                isPopular={true}
              />
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              30-Day Money-Back Guarantee
            </h3>
            <p className="text-gray-600">
              Not satisfied with your purchase? We offer a full refund within 30 days, 
              no questions asked. Your satisfaction is our priority.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}