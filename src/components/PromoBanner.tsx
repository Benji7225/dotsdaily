import { useSubscription } from '../hooks/useSubscription';

export default function PromoBanner() {
  const { isPremium } = useSubscription();

  if (isPremium) {
    return null;
  }

  return (
    <div className="bg-orange-500 text-white py-1 text-center">
      <span className="text-sm">3-day free trial • then €2.99/month or €19.90/year</span>
    </div>
  );
}
