import { Link } from 'react-router-dom';
import { Calendar, Clock, Heart, ArrowRight } from 'lucide-react';

export default function Examples() {
  const examples = [
    {
      title: "Année 2024 - Jour par Jour",
      description: "Suivez chaque jour de l'année, groupés par mois. Parfait pour visualiser votre progression annuelle.",
      icon: Calendar,
      color: "bg-blue-500",
      features: ["366 jours", "Groupé par mois", "Thème sombre"]
    },
    {
      title: "Année 2024 - Semaine par Semaine",
      description: "Une vue plus large de l'année avec 52 semaines. Idéal pour suivre vos objectifs hebdomadaires.",
      icon: Calendar,
      color: "bg-green-500",
      features: ["52 semaines", "Groupé par trimestre", "Thème clair"]
    },
    {
      title: "Compte à Rebours Mariage",
      description: "Comptez les jours jusqu'à votre grand jour. Chaque jour qui passe vous rapproche de ce moment unique.",
      icon: Clock,
      color: "bg-pink-500",
      features: ["Compte à rebours", "Par jour", "Thème personnalisé"]
    },
    {
      title: "Compte à Rebours Vacances",
      description: "30 jours avant vos vacances de rêve. Visualisez l'attente et profitez de l'anticipation.",
      icon: Clock,
      color: "bg-orange-500",
      features: ["30 jours", "Calendrier mensuel", "Image de fond"]
    },
    {
      title: "Calendrier de Vie - 30 ans",
      description: "Votre vie visualisée en semaines. Chaque point est une semaine de votre existence.",
      icon: Heart,
      color: "bg-purple-500",
      features: ["4000 semaines", "Perspective vie", "Inspirant"]
    },
    {
      title: "Calendrier de Vie - 50 ans",
      description: "Une vue d'ensemble de votre vie à mi-parcours. Célébrez le chemin parcouru.",
      icon: Heart,
      color: "bg-red-500",
      features: ["2600 semaines", "À mi-vie", "Motivant"]
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Exemples de Fonds d'Écran
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Découvrez différentes façons de visualiser votre temps. Chaque exemple peut être personnalisé selon vos préférences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {examples.map((example, index) => {
            const Icon = example.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className={`${example.color} p-6 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                  <div className="relative z-10">
                    <Icon className="w-10 h-10 text-white mb-3" />
                    <h3 className="text-xl font-bold text-white">{example.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {example.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {example.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">366</div>
            <div className="text-slate-600">jours dans une année</div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">52</div>
            <div className="text-slate-600">semaines dans une année</div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">4000</div>
            <div className="text-slate-600">semaines dans une vie de 80 ans</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">
            Inspiré par un Exemple ?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Créez votre propre fond d'écran personnalisé en quelques clics. C'est gratuit et illimité.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-50 transition-all shadow-lg group"
          >
            Créer le Mien
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Cas d'Usage Populaires
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Suivi d'Objectifs Annuels</h3>
                <p className="text-slate-600 text-sm">
                  Suivez votre progression vers vos résolutions du Nouvel An avec un fond d'écran qui se met à jour chaque jour.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Préparation d'Événements</h3>
                <p className="text-slate-600 text-sm">
                  Mariages, examens, compétitions sportives - gardez votre objectif en vue avec un compte à rebours visuel.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Conscience du Temps</h3>
                <p className="text-slate-600 text-sm">
                  Visualisez votre vie entière pour vous rappeler de profiter de chaque moment et de vivre intentionnellement.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Motivation Quotidienne</h3>
                <p className="text-slate-600 text-sm">
                  Chaque fois que vous déverrouillez votre téléphone, vous êtes rappelé de faire compter cette journée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
