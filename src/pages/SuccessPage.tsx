import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export function SuccessPage() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Welcome to Lifetime Premium! Your account has been upgraded.
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-green-900 mb-3">
            What's unlocked:
          </h2>
          <ul className="text-left space-y-2 text-green-800">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              Custom themes and colors
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              Advanced dot shapes
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              Time remaining display
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              Custom text overlay
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              All future updates
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center group"
          >
            Start Creating Wallpapers
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@example.com" className="text-green-600 hover:text-green-700">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}