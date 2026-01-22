import { Link } from 'react-router-dom';
import { Calendar, Clock, Heart, Sparkles, Download, Check } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/50" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(203 213 225 / 0.5) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Visualisez Votre Temps,<br />
              <span className="text-orange-600">Vivez Chaque Moment</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Créez des fonds d'écran personnalisés qui transforment votre iPhone en une horloge visuelle de votre vie.
              Chaque point représente un jour, une semaine, un mois ou une année.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/create"
                className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5" />
                Créer Mon Fond d'Écran
              </Link>
              <Link
                to="/examples"
                className="inline-flex items-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all shadow-lg border border-slate-200"
              >
                Voir des Exemples
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Année en Cours</h3>
              <p className="text-slate-600 leading-relaxed">
                Suivez votre progression tout au long de l'année. Chaque jour passé est marqué visuellement.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Compte à Rebours</h3>
              <p className="text-slate-600 leading-relaxed">
                Créez un compte à rebours pour vos événements importants : mariage, voyage, diplôme.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Calendrier de Vie</h3>
              <p className="text-slate-600 leading-relaxed">
                Visualisez votre vie entière en un coup d'œil. Chaque point est une semaine de votre existence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Comment Ça Marche ?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              En 3 étapes simples, créez un fond d'écran unique qui donne du sens à votre temps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Choisissez Votre Mode</h3>
              <p className="text-slate-600 leading-relaxed">
                Année en cours, compte à rebours ou calendrier de vie. Sélectionnez ce qui vous inspire.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Personnalisez</h3>
              <p className="text-slate-600 leading-relaxed">
                Choisissez les couleurs, la granularité (jour, semaine, mois) et le style qui vous correspond.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Téléchargez</h3>
              <p className="text-slate-600 leading-relaxed">
                Générez votre fond d'écran optimisé pour votre iPhone et définissez-le en quelques secondes.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-700 transition-all shadow-lg"
            >
              <Download className="w-5 h-5" />
              Commencer Maintenant
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Pourquoi DotsDaily ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">100% Gratuit</h3>
                <p className="text-slate-600">
                  Créez autant de fonds d'écran que vous voulez, sans frais cachés.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Optimisé iPhone</h3>
                <p className="text-slate-600">
                  Résolutions parfaites pour tous les modèles d'iPhone, de l'iPhone 14 au iPhone SE.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Personnalisation Totale</h3>
                <p className="text-slate-600">
                  Couleurs, images, granularité... Créez un fond d'écran unique qui vous ressemble.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Mise à Jour Automatique</h3>
                <p className="text-slate-600">
                  Générez un lien unique qui se met à jour automatiquement chaque jour.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Motivant</h3>
                <p className="text-slate-600">
                  Voir votre progression chaque jour vous inspire à profiter de chaque instant.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Confidentialité</h3>
                <p className="text-slate-600">
                  Vos données restent privées. Aucune information personnelle n'est collectée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à Visualiser Votre Temps ?
          </h2>
          <p className="text-xl mb-10 text-orange-100">
            Rejoignez des milliers de personnes qui utilisent DotsDaily pour donner du sens à leur temps.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-50 transition-all shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            Créer Mon Fond d'Écran Gratuitement
          </Link>
        </div>
      </section>
    </div>
  );
}
