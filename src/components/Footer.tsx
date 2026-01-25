import { Circle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Circle className="w-6 h-6 text-orange-500 fill-orange-500" />
              <span className="text-xl font-bold text-black">DotsDaily</span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              Turn your time, goals, and life progress into a daily-updating iPhone wallpaper powered by a simple PNG URL and Apple Shortcuts.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-3">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/generator" className="text-gray-600 hover:text-black transition-colors">
                  Generator
                </Link>
              </li>
              <li>
                <a href="#features" className="text-gray-600 hover:text-black transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-600 hover:text-black transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#faq" className="text-gray-600 hover:text-black transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="mailto:hello@dotsdaily.app" className="text-gray-600 hover:text-black transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} DotsDaily. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
