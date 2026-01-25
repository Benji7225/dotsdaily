import { Link } from 'react-router-dom';
import { Calendar, Heart, Target, Zap, Smartphone, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-20 pb-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
              Visualize Time.<br />Track Progress.<br />Stay Motivated.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
              Turn your life, goals, and daily progress into a beautiful iPhone wallpaper that updates automatically every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/generator"
                className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors inline-block"
              >
                Create Your Wallpaper
              </Link>
              <a
                href="#how-it-works"
                className="bg-white text-black border-2 border-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors inline-block"
              >
                See How It Works
              </a>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-lg">
            <img
              src="/dotsdaily_logo.webp"
              alt="DotsDaily wallpaper example"
              className="w-full max-w-md mx-auto rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            Why DotsDaily?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">No App Required</h3>
              <p className="text-gray-600">
                Just a simple PNG URL that works with Apple Shortcuts. No downloads, no subscriptions, no hassle.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Auto-Updates Daily</h3>
              <p className="text-gray-600">
                Your wallpaper refreshes automatically every day at midnight in your timezone. Set it once, enjoy forever.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Fully Customizable</h3>
              <p className="text-gray-600">
                Choose your theme, colors, layout, and iPhone model. Make it truly yours with custom text and backgrounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            Multiple Visualization Modes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-3">Year Progress</h3>
              <p className="text-gray-600">
                Track every day of the year with a visual dot calendar. See your progress through 2025 at a glance.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-3">Life Calendar</h3>
              <p className="text-gray-600">
                Visualize your entire life in dots. Each dot represents a year. See how far you've come and what remains.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-3">Goal Countdown</h3>
              <p className="text-gray-600">
                Set a target date and count down the days. Perfect for challenges, deadlines, or special events.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            How It Works
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">Configure Your Wallpaper</h3>
                <p className="text-gray-600">
                  Choose your visualization mode, colors, dates, and iPhone model. Preview it in real-time.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">Generate Your URL</h3>
                <p className="text-gray-600">
                  Click "Generate URL" and get your permanent wallpaper link. This URL always returns a fresh PNG image.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">Set Up Apple Shortcuts</h3>
                <p className="text-gray-600">
                  Create a simple automation in Apple Shortcuts that fetches your wallpaper URL and sets it as your background daily.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">Enjoy Daily Updates</h3>
                <p className="text-gray-600">
                  Your wallpaper updates automatically every day at midnight. Watch your progress grow day by day.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/generator"
              className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors inline-block"
            >
              Start Creating Now
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-black mb-2">Is DotsDaily really free?</h3>
              <p className="text-gray-600">
                Yes! The core features are completely free. We may introduce premium customization options in the future, but the essential wallpaper generator will always be free.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-black mb-2">Does it work on Android?</h3>
              <p className="text-gray-600">
                Currently, DotsDaily is optimized for iOS and Apple Shortcuts. Android support is not available yet, but we're exploring options for the future.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-black mb-2">Will my URL expire?</h3>
              <p className="text-gray-600">
                No! Once generated, your wallpaper URL is permanent and will keep working as long as DotsDaily exists. We're built to last for years.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-black mb-2">Can I change my wallpaper settings later?</h3>
              <p className="text-gray-600">
                Your URL is linked to specific settings. If you want different settings, simply generate a new URL and update your Shortcuts automation.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-black mb-2">How does the life calendar work?</h3>
              <p className="text-gray-600">
                Enter your birth date and life expectancy (default is 80 years). Each dot represents one year of your life. Filled dots show years lived, empty dots show years remaining.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-orange-500">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Visualize Your Progress?
          </h2>
          <p className="text-xl text-orange-100 mb-10">
            Create your custom iPhone wallpaper in less than 2 minutes.
          </p>
          <Link
            to="/generator"
            className="bg-white text-orange-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
