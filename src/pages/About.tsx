import { Calendar, Target, Heart, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            À Propos de Life Calendar
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Un outil simple pour visualiser votre temps et donner du sens à chaque jour
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Notre Mission</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Life Calendar a été créé avec une conviction simple : <strong>visualiser le temps nous aide à mieux le vivre</strong>.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Dans notre quotidien hyperconnecté, il est facile de perdre de vue le temps qui passe. Les jours se succèdent,
              les semaines s'enchaînent, et avant même de nous en rendre compte, une année entière s'est écoulée.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Life Calendar transforme votre écran de verrouillage en un rappel visuel constant de votre progression dans le temps.
              Chaque point représente une unité de temps - un jour, une semaine, un mois - et vous montre exactement où vous en êtes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Conscience du Temps</h3>
              <p className="text-slate-600 leading-relaxed">
                Voir visuellement le temps qui passe vous aide à prendre conscience de chaque instant et à vivre plus intentionnellement.
              </p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Motivation Quotidienne</h3>
              <p className="text-slate-600 leading-relaxed">
                Suivez vos objectifs et compte à rebours importants. Chaque jour est un pas de plus vers vos rêves.
              </p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Perspective de Vie</h3>
              <p className="text-slate-600 leading-relaxed">
                Le calendrier de vie vous montre votre existence entière en un coup d'œil, vous rappelant de faire compter chaque semaine.
              </p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Simple et Efficace</h3>
              <p className="text-slate-600 leading-relaxed">
                Pas d'application à installer, pas de notifications intrusives. Juste un fond d'écran qui se met à jour automatiquement.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white mb-8">
            <h2 className="text-3xl font-bold mb-4">L'Inspiration</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Life Calendar s'inspire du concept de "Life in Weeks" popularisé par Tim Urban de Wait But Why.
              L'idée est simple mais puissante : si vous vivez 80 ans, vous avez environ 4 000 semaines à vivre.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Visualiser votre vie de cette manière change votre perspective. Soudain, chaque semaine devient précieuse,
              chaque mois compte, et vous réalisez que le temps est la ressource la plus limitée que nous ayons.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Gratuit et Open Source</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Life Calendar est 100% gratuit et le restera toujours. Nous croyons que tout le monde devrait avoir accès
              à des outils qui les aident à vivre une vie plus intentionnelle.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Vos données restent privées. Nous ne collectons aucune information personnelle et ne suivons pas votre utilisation.
              Votre configuration est stockée uniquement pour générer votre fond d'écran personnalisé.
            </p>
          </div>

          <div className="text-center bg-orange-50 rounded-2xl p-8 border border-orange-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Prêt à Commencer ?
            </h2>
            <p className="text-slate-600 mb-6">
              Créez votre premier fond d'écran et commencez à visualiser votre temps différemment.
            </p>
            <a
              href="/create"
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors shadow-lg"
            >
              Créer Mon Fond d'Écran
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
