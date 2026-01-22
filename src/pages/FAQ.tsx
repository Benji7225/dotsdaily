import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-900 pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-slate-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const faqs = [
    {
      question: "Comment utiliser mon fond d'écran généré ?",
      answer: "Une fois votre fond d'écran généré, vous recevrez un lien unique. Ouvrez ce lien sur votre iPhone, appuyez longuement sur l'image et sélectionnez 'Ajouter à Photos' ou 'Définir comme fond d'écran'. Vous pouvez aussi configurer un Raccourci iOS pour que le fond d'écran se mette à jour automatiquement chaque jour."
    },
    {
      question: "Mon fond d'écran se met-il à jour automatiquement ?",
      answer: "Oui ! Le lien généré affiche toujours le fond d'écran à jour en fonction de la date actuelle. Pour une mise à jour automatique quotidienne, vous pouvez créer un Raccourci iOS qui télécharge l'image depuis le lien et la définit comme fond d'écran."
    },
    {
      question: "Quels modèles d'iPhone sont supportés ?",
      answer: "DotsDaily supporte tous les modèles d'iPhone récents, y compris les séries iPhone 14, 13, 12, 11, XS, XR, SE, et plus. Chaque fond d'écran est optimisé pour les dimensions exactes et la zone sécurisée de votre modèle."
    },
    {
      question: "Puis-je personnaliser les couleurs ?",
      answer: "Absolument ! Vous pouvez choisir parmi des thèmes prédéfinis (noir, blanc), utiliser une couleur personnalisée pour le fond, ou même télécharger votre propre image de fond. Vous pouvez également personnaliser la couleur du point qui marque votre position actuelle."
    },
    {
      question: "Qu'est-ce que le mode 'Calendrier de Vie' ?",
      answer: "Le mode Calendrier de Vie visualise votre vie entière en semaines, mois ou années. Entrez votre date de naissance et votre espérance de vie, et vous verrez un aperçu visuel de toute votre existence, avec les semaines déjà vécues marquées."
    },
    {
      question: "Comment fonctionne le mode 'Compte à Rebours' ?",
      answer: "Le mode Compte à Rebours vous permet de créer un fond d'écran pour un événement futur important : mariage, voyage, examen, anniversaire, etc. Entrez la date de début et la date cible, et chaque jour écoulé sera marqué visuellement."
    },
    {
      question: "Mes données sont-elles privées et sécurisées ?",
      answer: "Oui, votre confidentialité est notre priorité. Nous stockons uniquement la configuration de votre fond d'écran (dates, couleurs, préférences) pour générer l'image. Aucune information personnelle identifiable n'est collectée, et nous ne suivons pas votre utilisation du service."
    },
    {
      question: "Le service est-il vraiment gratuit ?",
      answer: "Oui, DotsDaily est 100% gratuit et le restera toujours. Il n'y a pas de frais cachés, pas d'abonnement, pas de publicités. Notre mission est de rendre cet outil accessible à tous."
    },
    {
      question: "Puis-je créer plusieurs fonds d'écran ?",
      answer: "Oui, vous pouvez créer autant de fonds d'écran que vous le souhaitez ! Vous pourriez en avoir un pour l'année en cours, un autre pour un compte à rebours vers un événement, et un autre pour visualiser votre vie entière."
    },
    {
      question: "Que signifie 'grouper par mois' ou 'grouper par semaine' ?",
      answer: "Les options de groupement organisent visuellement vos points par périodes. Par exemple, si vous suivez l'année par jours, 'grouper par mois' créera 12 sections distinctes (une pour chaque mois). Cela rend le fond d'écran plus lisible et organisé."
    },
    {
      question: "Puis-je partager mon lien avec d'autres personnes ?",
      answer: "Techniquement oui, mais gardez à l'esprit que le lien peut contenir des informations personnelles comme votre date de naissance si vous utilisez le mode Calendrier de Vie. Nous vous recommandons de garder vos liens privés."
    },
    {
      question: "Comment créer un Raccourci iOS pour la mise à jour automatique ?",
      answer: "Dans l'app Raccourcis sur iPhone : 1) Créez un nouveau raccourci, 2) Ajoutez 'Obtenir le contenu de l'URL' avec votre lien, 3) Ajoutez 'Définir le fond d'écran', 4) Configurez une automatisation pour qu'elle s'exécute chaque jour. Vous trouverez des tutoriels détaillés en ligne."
    },
    {
      question: "Le fond d'écran s'adapte-t-il au mode sombre/clair de l'iPhone ?",
      answer: "Les fonds d'écran DotsDaily ne changent pas automatiquement avec le mode de votre iPhone. À la place, vous choisissez le thème (clair, sombre, ou personnalisé) lors de la création. Vous pouvez créer deux versions si vous changez régulièrement de mode."
    },
    {
      question: "Puis-je utiliser DotsDaily sur Android ?",
      answer: "Actuellement, DotsDaily est optimisé pour iPhone. Cependant, le concept fonctionne sur n'importe quel appareil - les dimensions peuvent simplement ne pas être parfaitement adaptées. Une version Android dédiée pourrait être développée à l'avenir."
    },
    {
      question: "Que se passe-t-il quand l'année se termine (mode Année) ?",
      answer: "Lorsque l'année se termine, vous devrez créer un nouveau fond d'écran pour la nouvelle année. Nous vous recommandons de créer le nouveau en décembre pour une transition en douceur le 1er janvier."
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Questions Fréquentes
          </h1>
          <p className="text-xl text-slate-600">
            Tout ce que vous devez savoir sur DotsDaily
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-12 text-center bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Vous avez d'autres questions ?
          </h2>
          <p className="text-slate-600 mb-6">
            N'hésitez pas à nous contacter ou à consulter notre documentation complète.
          </p>
          <a
            href="/create"
            className="inline-block bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors shadow-lg"
          >
            Essayer Maintenant
          </a>
        </div>
      </div>
    </div>
  );
}
