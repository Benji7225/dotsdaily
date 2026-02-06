import { useSubscription } from '../hooks/useSubscription';

export default function PromoBanner() {
  const { isPremium } = useSubscription();

  if (isPremium) {
    return null;
  }

  return (
    <div className="bg-orange-500 text-white py-0.5 overflow-hidden">
      <div className="animate-scroll whitespace-nowrap">
        <span className="inline-block px-4">3-day free trial • then €2.99/month or €19.90/year</span>
        <span className="inline-block px-4">3-day free trial • then €2.99/month or €19.90/year</span>
        <span className="inline-block px-4">3-day free trial • then €2.99/month or €19.90/year</span>
        <span className="inline-block px-4">3-day free trial • then €2.99/month or €19.90/year</span>
        <span className="inline-block px-4">3-day free trial • then €2.99/month or €19.90/year</span>
        <span className="inline-block px-4">3-day free trial • then €2.99/month or €19.90/year</span>
      </div>
    </div>
  );
}
