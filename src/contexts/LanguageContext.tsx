import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'fr') ? saved : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

const translations = {
  fr: {
    nav: {
      home: 'Accueil',
      generator: 'Générateur',
      pricing: 'Tarifs',
      getStarted: 'Commencer',
      signIn: 'Se Connecter',
      signOut: 'Se Déconnecter'
    },
    auth: {
      signInWithGoogle: 'Continuer avec Google',
      signInRequired: 'Connexion Requise',
      signInMessage: 'Tu dois être connecté pour générer une URL de fond d\'écran.',
      signInButton: 'Se Connecter avec Google',
      welcome: 'Bienvenue',
      cancel: 'Annuler'
    },
    pricing: {
      title: 'Tarifs Simples et Transparents',
      subtitle: 'Commence gratuitement, passe au premium pour débloquer toutes les fonctionnalités.',
      free: {
        name: 'Gratuit',
        period: 'pour toujours',
        description: 'Parfait pour commencer avec les fonctionnalités essentielles.',
        cta: 'Plan Actuel',
        features: [
          'Modes année, vie et compte à rebours',
          'Tous les modèles d\'iPhone',
          'Thèmes sombre et clair',
          'Mise à jour automatique quotidienne',
          'Groupement par mois',
        ]
      },
      premium: {
        name: 'Premium',
        period: 'par mois',
        badge: 'Populaire',
        description: 'Débloque toutes les fonctionnalités pour personnaliser à fond.',
        cta: 'Passer à Premium',
        ctaLoading: 'Chargement...',
        features: [
          'Toutes les fonctionnalités gratuites',
          'Texte personnalisé sur le fond d\'écran',
          'Groupement par trimestre',
          'Couleurs personnalisées avec pipette',
          'Couleur des points personnalisable',
          'Support prioritaire',
        ]
      },
      comparison: {
        title: 'Comparaison Détaillée',
        feature: 'Fonctionnalité',
        items: [
          { name: 'Modes année, vie et objectif', free: true, premium: false },
          { name: 'Tous les modèles d\'iPhone', free: true, premium: false },
          { name: 'Thèmes sombre et clair', free: true, premium: false },
          { name: 'Mise à jour automatique', free: true, premium: false },
          { name: 'Groupement par mois', free: true, premium: false },
          { name: 'Texte personnalisé', free: false, premium: true },
          { name: 'Groupement par trimestre', free: false, premium: true },
          { name: 'Pipette de couleur personnalisée', free: false, premium: true },
          { name: 'Couleur des points personnalisable', free: false, premium: true },
        ]
      }
    },
    home: {
      hero: {
        title: 'Suis ta progression \n en fond d\'écran',
        subtitle: 'Transforme ta vie, tes objectifs et ta progression quotidienne en un magnifique fond d\'écran iPhone qui se met à jour automatiquement chaque jour.',
        cta: 'Créer ton Fond d\'Écran',
        learn: 'Voir Comment ça Marche'
      },
      features: {
        title: 'Pourquoi DotsDaily ?',
        noApp: {
          title: 'Aucune App Requise',
          desc: 'Juste une simple URL PNG qui fonctionne avec Raccourcis Apple. Pas de téléchargement, pas d\'abonnement, pas de prise de tête.'
        },
        autoUpdate: {
          title: 'Mise à Jour Quotidienne',
          desc: 'Ton fond d\'écran se rafraîchit automatiquement chaque jour à minuit dans ton fuseau horaire. Configure une fois, profite pour toujours.'
        },
        custom: {
          title: 'Entièrement Personnalisable',
          desc: 'Choisis ton thème, tes couleurs, ta mise en page et ton modèle d\'iPhone. Personnalise-le avec du texte et des arrière-plans.'
        }
      },
      modes: {
        title: 'Plusieurs Modes de Visualisation',
        year: {
          title: 'Progression Annuelle',
          desc: 'Suis chaque jour de l\'année avec un calendrier visuel en points. Vois ta progression à travers 2025 en un coup d\'œil.'
        },
        life: {
          title: 'Calendrier de Vie',
          desc: 'Visualise toute ta vie en points. Chaque point représente une année. Vois le chemin parcouru et ce qui reste.'
        },
        goal: {
          title: 'Compte à Rebours',
          desc: 'Définis une date cible et compte les jours. Parfait pour les défis, les échéances ou les événements spéciaux.'
        }
      },
      howItWorks: {
        title: 'Comment ça Marche',
        step1: {
          title: 'Configure ton Fond d\'Écran',
          desc: 'Choisis ton mode de visualisation, tes couleurs, tes dates et ton modèle d\'iPhone. Prévisualise en temps réel.'
        },
        step2: {
          title: 'Génère ton URL',
          desc: 'Clique sur "Générer l\'URL" et obtiens ton lien permanent. Cette URL retourne toujours une image PNG fraîche.'
        },
        step3: {
          title: 'Configure Raccourcis Apple',
          desc: 'Crée une automatisation simple dans Raccourcis Apple qui récupère ton URL et la définit comme fond d\'écran quotidiennement.'
        },
        step4: {
          title: 'Profite des Mises à Jour',
          desc: 'Ton fond d\'écran se met à jour automatiquement chaque jour à minuit. Regarde ta progression grandir jour après jour.'
        },
        cta: 'Commencer Maintenant'
      },
      faq: {
        title: 'Questions Fréquentes',
        q1: {
          q: 'DotsDaily est-il vraiment gratuit ?',
          a: 'Oui ! Les fonctionnalités principales sont entièrement gratuites. Nous pourrions introduire des options de personnalisation premium à l\'avenir, mais le générateur essentiel restera toujours gratuit.'
        },
        q2: {
          q: 'Ça fonctionne sur Android ?',
          a: 'Actuellement, DotsDaily est optimisé pour iOS et Raccourcis Apple. Le support Android n\'est pas encore disponible, mais nous explorons des options pour l\'avenir.'
        },
        q3: {
          q: 'Mon URL va-t-elle expirer ?',
          a: 'Non ! Une fois générée, ton URL de fond d\'écran est permanente et continuera de fonctionner tant que DotsDaily existe. Nous sommes conçus pour durer des années.'
        },
        q4: {
          q: 'Puis-je modifier mes paramètres plus tard ?',
          a: 'Ton URL est liée à des paramètres spécifiques. Si tu veux des paramètres différents, génère simplement une nouvelle URL et mets à jour ton automatisation Raccourcis.'
        },
        q5: {
          q: 'Comment fonctionne le calendrier de vie ?',
          a: 'Entre ta date de naissance et ton espérance de vie (par défaut 80 ans). Chaque point représente une année de ta vie. Les points remplis montrent les années vécues, les points vides les années restantes.'
        }
      },
      cta: {
        title: 'Prêt à Visualiser ta Progression ?',
        subtitle: 'Crée ton fond d\'écran iPhone personnalisé en moins de 2 minutes.',
        button: 'Commencer Gratuitement'
      }
    },
    generator: {
      title: 'Générateur de Fond d\'Écran',
      subtitle: 'Personnalise ton fond d\'écran iPhone auto-actualisé',
      modes: {
        year: {
          name: 'Année',
          desc: 'Suis chaque jour de l\'année'
        },
        life: {
          name: 'Vie',
          desc: 'Visualise toute ta vie'
        },
        goal: {
          name: 'Objectif',
          desc: 'Compte à rebours vers une date'
        }
      },
      url: {
        title: 'Ton URL de Fond d\'Écran',
        generate: 'Générer l\'URL',
        generating: 'Génération...',
        regenerate: 'Régénérer l\'URL',
        copy: 'Copier',
        copied: 'Copié !',
        placeholder: 'Clique pour générer une URL permanente. Ton fond d\'écran se mettra automatiquement à jour chaque jour à minuit dans ton fuseau horaire.',
        setup: {
          title: 'Configuration Raccourcis Apple',
          step1: 'Raccourcis → Automatisation → + → Heure de la journée',
          step2: 'Règle sur 00:00 → Tous les jours → Exécuter immédiatement',
          step3: 'Nouvelle automatisation',
          step4: 'Ajoute "Obtenir le contenu de l\'URL" → colle ton URL',
          step5: 'Ajoute "Définir la photo de fond d\'écran"',
          step6: 'Appuie sur > pour désactiver "Recadrer sur le sujet" et "Afficher l\'aperçu"',
          step7: 'Appuie sur le bouton en bas à droite pour lancer',
          note: 'Ton fond d\'écran se mettra à jour automatiquement chaque jour à minuit dans ton fuseau horaire.'
        }
      }
    },
    footer: {
      tagline: 'Transforme ton temps, tes objectifs et ta progression de vie en un fond d\'écran iPhone qui se met à jour quotidiennement, propulsé par une simple URL PNG et Raccourcis Apple.',
      product: 'Produit',
      support: 'Support',
      generator: 'Générateur',
      features: 'Fonctionnalités',
      howItWorks: 'Comment ça Marche',
      faq: 'FAQ',
      contact: 'Contact',
      rights: 'Tous droits réservés.'
    }
  },
  en: {
    nav: {
      home: 'Home',
      generator: 'Generator',
      pricing: 'Pricing',
      getStarted: 'Get Started',
      signIn: 'Sign In',
      signOut: 'Sign Out'
    },
    auth: {
      signInWithGoogle: 'Continue with Google',
      signInRequired: 'Sign In Required',
      signInMessage: 'You need to be signed in to generate a wallpaper URL.',
      signInButton: 'Sign In with Google',
      welcome: 'Welcome',
      cancel: 'Cancel'
    },
    pricing: {
      title: 'Simple and Transparent Pricing',
      subtitle: 'Start for free, upgrade to premium to unlock all features.',
      free: {
        name: 'Free',
        period: 'forever',
        description: 'Perfect to get started with essential features.',
        cta: 'Current Plan',
        features: [
          'Year, life and countdown modes',
          'All iPhone models',
          'Dark and light themes',
          'Daily automatic update',
          'Monthly grouping',
        ]
      },
      premium: {
        name: 'Premium',
        period: 'per month',
        badge: 'Popular',
        description: 'Unlock all features for full customization.',
        cta: 'Upgrade to Premium',
        ctaLoading: 'Loading...',
        features: [
          'All free features',
          'Custom text on wallpaper',
          'Quarterly grouping',
          'Custom colors with picker',
          'Customizable dot color',
          'Priority support',
        ]
      },
      comparison: {
        title: 'Detailed Comparison',
        feature: 'Feature',
        items: [
          { name: 'Year, life and goal modes', free: true, premium: false },
          { name: 'All iPhone models', free: true, premium: false },
          { name: 'Dark and light themes', free: true, premium: false },
          { name: 'Automatic updates', free: true, premium: false },
          { name: 'Monthly grouping', free: true, premium: false },
          { name: 'Custom text', free: false, premium: true },
          { name: 'Quarterly grouping', free: false, premium: true },
          { name: 'Custom color picker', free: false, premium: true },
          { name: 'Customizable dot color', free: false, premium: true },
        ]
      }
    },
    home: {
      hero: {
        title: 'Visualize Time.\nTrack Progress.\nStay Motivated.',
        subtitle: 'Turn your life, goals, and daily progress into a beautiful iPhone wallpaper that updates automatically every day.',
        cta: 'Create Your Wallpaper',
        learn: 'See How It Works'
      },
      features: {
        title: 'Why DotsDaily?',
        noApp: {
          title: 'No App Required',
          desc: 'Just a simple PNG URL that works with Apple Shortcuts. No downloads, no subscriptions, no hassle.'
        },
        autoUpdate: {
          title: 'Auto-Updates Daily',
          desc: 'Your wallpaper refreshes automatically every day at midnight in your timezone. Set it once, enjoy forever.'
        },
        custom: {
          title: 'Fully Customizable',
          desc: 'Choose your theme, colors, layout, and iPhone model. Make it truly yours with custom text and backgrounds.'
        }
      },
      modes: {
        title: 'Multiple Visualization Modes',
        year: {
          title: 'Year Progress',
          desc: 'Track every day of the year with a visual dot calendar. See your progress through 2025 at a glance.'
        },
        life: {
          title: 'Life Calendar',
          desc: 'Visualize your entire life in dots. Each dot represents one year. See how far you\'ve come and what remains.'
        },
        goal: {
          title: 'Goal Countdown',
          desc: 'Set a target date and count down the days. Perfect for challenges, deadlines, or special events.'
        }
      },
      howItWorks: {
        title: 'How It Works',
        step1: {
          title: 'Configure Your Wallpaper',
          desc: 'Choose your visualization mode, colors, dates, and iPhone model. Preview it in real-time.'
        },
        step2: {
          title: 'Generate Your URL',
          desc: 'Click "Generate URL" and get your permanent wallpaper link. This URL always returns a fresh PNG image.'
        },
        step3: {
          title: 'Set Up Apple Shortcuts',
          desc: 'Create a simple automation in Apple Shortcuts that fetches your wallpaper URL and sets it as your background daily.'
        },
        step4: {
          title: 'Enjoy Daily Updates',
          desc: 'Your wallpaper updates automatically every day at midnight. Watch your progress grow day by day.'
        },
        cta: 'Start Creating Now'
      },
      faq: {
        title: 'Frequently Asked Questions',
        q1: {
          q: 'Is DotsDaily really free?',
          a: 'Yes! The core features are completely free. We may introduce premium customization options in the future, but the essential wallpaper generator will always be free.'
        },
        q2: {
          q: 'Does it work on Android?',
          a: 'Currently, DotsDaily is optimized for iOS and Apple Shortcuts. Android support is not available yet, but we\'re exploring options for the future.'
        },
        q3: {
          q: 'Will my URL expire?',
          a: 'No! Once generated, your wallpaper URL is permanent and will keep working as long as DotsDaily exists. We\'re built to last for years.'
        },
        q4: {
          q: 'Can I change my wallpaper settings later?',
          a: 'Your URL is linked to specific settings. If you want different settings, simply generate a new URL and update your Shortcuts automation.'
        },
        q5: {
          q: 'How does the life calendar work?',
          a: 'Enter your birth date and life expectancy (default is 80 years). Each dot represents one year of your life. Filled dots show years lived, empty dots show years remaining.'
        }
      },
      cta: {
        title: 'Ready to Visualize Your Progress?',
        subtitle: 'Create your custom iPhone wallpaper in less than 2 minutes.',
        button: 'Get Started Free'
      }
    },
    generator: {
      title: 'Wallpaper Generator',
      subtitle: 'Customize your daily-updating iPhone wallpaper',
      modes: {
        year: {
          name: 'Year',
          desc: 'Track every day of the year'
        },
        life: {
          name: 'Life',
          desc: 'Visualize your entire life'
        },
        goal: {
          name: 'Goal',
          desc: 'Countdown to a target date'
        }
      },
      url: {
        title: 'Your Wallpaper URL',
        generate: 'Generate URL',
        generating: 'Generating...',
        regenerate: 'Regenerate URL',
        copy: 'Copy',
        copied: 'Copied!',
        placeholder: 'Click to generate a permanent URL. Your wallpaper will automatically update daily at midnight in your timezone.',
        setup: {
          title: 'Apple Shortcuts Setup',
          step1: 'Shortcuts → Automation → + → Time of Day',
          step2: 'Set to 00:00 → Daily → Run Immediately',
          step3: 'Add "Get Contents of URL" → paste your URL',
          step4: 'Add "Set Wallpaper" → Lock Screen',
          step5: 'Tap → to disable "Crop to Subject" and "Show Preview"',
          step6: '',
          note: 'Your wallpaper will update automatically every day at midnight in your timezone.'
        }
      }
    },
    footer: {
      tagline: 'Turn your time, goals, and life progress into a daily-updating iPhone wallpaper powered by a simple PNG URL and Apple Shortcuts.',
      product: 'Product',
      support: 'Support',
      generator: 'Generator',
      features: 'Features',
      howItWorks: 'How It Works',
      faq: 'FAQ',
      contact: 'Contact',
      rights: 'All rights reserved.'
    }
  }
};
