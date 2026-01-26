import React from 'react';
import { Header } from '../components/layout/Header';
import { PricingSection } from '../components/pricing/PricingSection';

export function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PricingSection />
      </main>
    </div>
  );
}