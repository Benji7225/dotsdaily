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
    if (saved === 'en' || saved === 'fr') {
      return saved;
    }

    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('fr')) {
      return 'fr';
    }

    return 'en';
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
    wallpaper: {
      months: ['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin', 'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
      quarters: ['T1', 'T2', 'T3', 'T4'],
      timeRemaining: {
        days: 'j restants',
        weeks: 's restantes',
        months: 'm restants',
        years: 'a restantes'
      }
    },
    config: {
      title: 'Configuration',
      iphoneModel: 'Modèle d\'iPhone',
      dots: 'Points',
      group: 'Groupe',
      background: 'Arrière plan',
      premium: 'Premium',
      blackBackground: 'Fond noir',
      whiteBackground: 'Fond blanc',
      customColor: 'Couleur personnalisée',
      customImage: 'Image personnalisée',
      dotColor: 'Couleur du point',
      orangeDefault: 'Orange (par défaut)',
      shape: 'Forme',
      circle: 'Rond',
      square: 'Carré',
      heart: 'Cœur',
      customText: 'Texte personnalisé',
      additionalDisplay: 'Affichage supplémentaire',
      showPercentage: 'Afficher le pourcentage',
      timeRemaining: 'Temps restant',
      noDisplay: 'Aucun affichage supplémentaire',
      nothing: 'Rien',
      birthDate: 'Date de naissance',
      lifeExpectancy: 'Espérance de vie (années)',
      startDate: 'Date de début',
      targetDate: 'Date cible',
      yearInfo: 'Affiche la progression dans l\'année en cours avec la granularité choisie.',
      granularity: {
        day: 'Jour',
        week: 'Semaine',
        month: 'Mois',
        year: 'Année'
      },
      grouping: {
        none: 'Aucun',
        month: 'Mois',
        quarter: 'Trimestre'
      },
      imageMaxSize: 'Max 3 Mo',
      imageErrors: {
        tooLarge: 'Image trop volumineuse. Utilise une image de moins de 3 Mo.',
        invalidFormat: 'Format d\'image invalide. Utilise JPEG, PNG ou WebP.',
        dataTooLarge: 'Données image trop volumineuses après encodage. Utilise une image plus petite ou plus compressée.',
        readError: 'Échec de la lecture du fichier image. Essaie une autre image.'
      }
    },
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
        period: 'à vie',
        badge: 'Populaire',
        description: 'Débloque toutes les fonctionnalités avec un paiement unique.',
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
        title: 'Ta vie. \n Un point à la fois.',
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
          desc: 'Suis chaque jour de l\'année avec un calendrier visuel en points. Vois ta progression à travers 2026 en un coup d\'œil.'
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
      title: 'Chaque Jour Compte',
      subtitle: 'Transforme le temps en motivation avec ton fond d\'écran quotidien',
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
          step6: 'Désactive "Recadrer sur le sujet" et "Afficher l\'aperçu"',
          step7: 'Lance avec le bouton ▶︎ en bas à droite',
          note: 'Ton fond d\'écran se mettra à jour automatiquement chaque jour à minuit dans ton fuseau horaire.'
        }
      }
    },
    footer: {
      tagline: 'Transforme ton temps, tes objectifs et ta progression de vie en un fond d\'écran iPhone qui se met à jour quotidiennement, propulsé par une simple URL PNG et Raccourcis Apple.',
      product: 'Produit',
      support: 'Support',
      legal: 'Légal',
      generator: 'Générateur',
      features: 'Fonctionnalités',
      howItWorks: 'Comment ça Marche',
      faq: 'FAQ',
      contact: 'Contact',
      about: 'À Propos',
      privacy: 'Confidentialité',
      terms: 'Conditions',
      legalNotice: 'Mentions Légales',
      rights: 'Tous droits réservés.'
    },
    privacy: {
      title: 'Politique de Confidentialité',
      lastUpdated: 'Dernière mise à jour : 26 janvier 2026',
      intro: {
        title: 'Introduction',
        content: 'Chez DotsDaily, nous prenons ta vie privée au sérieux. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons tes informations personnelles lorsque tu utilises notre service.'
      },
      dataCollected: {
        title: 'Données Collectées',
        intro: 'Nous collectons les informations suivantes :',
        item1: 'Informations de compte (email, nom) si tu crées un compte',
        item2: 'Paramètres de configuration de fond d\'écran (dates, couleurs, préférences)',
        item3: 'Informations de paiement via Stripe pour l\'accès premium',
        item4: 'Données d\'utilisation et analytics pour améliorer notre service'
      },
      howWeUse: {
        title: 'Comment Nous Utilisons Tes Données',
        item1: 'Générer et fournir tes fonds d\'écran personnalisés',
        item2: 'Gérer ton compte et tes préférences',
        item3: 'Traiter les paiements',
        item4: 'Améliorer notre service et développer de nouvelles fonctionnalités'
      },
      dataStorage: {
        title: 'Stockage des Données',
        content: 'Toutes tes données sont stockées de manière sécurisée sur Supabase, une plateforme de base de données conforme RGPD. Nous utilisons un chiffrement de bout en bout pour protéger tes informations.'
      },
      cookies: {
        title: 'Cookies',
        content: 'Nous utilisons des cookies essentiels pour maintenir ta session et mémoriser tes préférences linguistiques. Aucun cookie de suivi tiers n\'est utilisé.'
      },
      rights: {
        title: 'Tes Droits',
        item1: 'Accéder à tes données personnelles',
        item2: 'Rectifier ou supprimer tes données',
        item3: 'Exporter tes données',
        item4: 'T\'opposer au traitement de tes données'
      },
      security: {
        title: 'Sécurité',
        content: 'Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger tes données contre tout accès, modification, divulgation ou destruction non autorisés.'
      },
      changes: {
        title: 'Modifications',
        content: 'Nous pouvons mettre à jour cette politique de temps en temps. Nous te notifierons de tout changement significatif par email ou via une notification sur le site.'
      },
      contact: {
        title: 'Contact',
        content: 'Pour toute question concernant cette politique de confidentialité, contacte-nous à'
      }
    },
    terms: {
      title: 'Conditions d\'Utilisation',
      lastUpdated: 'Dernière mise à jour : 26 janvier 2026',
      acceptance: {
        title: 'Acceptation des Conditions',
        content: 'En utilisant DotsDaily, tu acceptes ces conditions d\'utilisation. Si tu n\'es pas d\'accord avec ces conditions, n\'utilise pas notre service.'
      },
      service: {
        title: 'Description du Service',
        content: 'DotsDaily fournit un service de génération de fonds d\'écran iPhone personnalisés qui se mettent à jour automatiquement. Le service est accessible via une URL PNG et fonctionne avec Raccourcis Apple.'
      },
      account: {
        title: 'Compte Utilisateur',
        item1: 'Tu es responsable de maintenir la confidentialité de ton compte',
        item2: 'Tu dois fournir des informations exactes et à jour',
        item3: 'Tu es responsable de toute activité sur ton compte'
      },
      usage: {
        title: 'Utilisation Acceptable',
        intro: 'Tu acceptes de ne pas :',
        item1: 'Utiliser le service à des fins illégales',
        item2: 'Tenter de perturber ou surcharger nos serveurs',
        item3: 'Copier, modifier ou distribuer notre contenu sans autorisation',
        item4: 'Utiliser des bots ou scripts automatisés sans autorisation'
      },
      intellectual: {
        title: 'Propriété Intellectuelle',
        content: 'DotsDaily et tout son contenu sont protégés par les lois sur le droit d\'auteur. Les fonds d\'écran générés t\'appartiennent, mais notre plateforme et notre technologie restent notre propriété.'
      },
      payment: {
        title: 'Paiements',
        content: 'L\'accès Premium est un paiement unique de 2,99€ via Stripe qui te donne un accès à vie aux fonctionnalités premium. Les remboursements sont traités au cas par cas dans les 14 jours suivant l\'achat.'
      },
      limitation: {
        title: 'Limitation de Responsabilité',
        content: 'DotsDaily est fourni "tel quel" sans garantie. Nous ne sommes pas responsables des dommages résultant de l\'utilisation ou de l\'impossibilité d\'utiliser notre service.'
      },
      termination: {
        title: 'Résiliation',
        content: 'Nous nous réservons le droit de suspendre ou de résilier ton compte en cas de violation de ces conditions.'
      },
      changes: {
        title: 'Modifications',
        content: 'Nous pouvons modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication.'
      },
      contact: {
        title: 'Contact',
        content: 'Pour toute question concernant ces conditions, contacte-nous à'
      }
    },
    legal: {
      title: 'Mentions Légales',
      subtitle: 'Informations légales conformément à la loi',
      publisher: {
        title: 'Éditeur du Site',
        name: 'Nom',
        email: 'Email',
        website: 'Site Web'
      },
      hosting: {
        title: 'Hébergement',
        provider: 'Hébergeur',
        address: 'Adresse',
        website: 'Site Web'
      },
      database: {
        title: 'Base de Données',
        provider: 'Fournisseur',
        website: 'Site Web'
      },
      intellectual: {
        title: 'Propriété Intellectuelle',
        content: 'L\'ensemble du contenu de ce site (textes, images, logos, design) est la propriété de DotsDaily et est protégé par les lois sur la propriété intellectuelle.'
      },
      personal: {
        title: 'Données Personnelles',
        content: 'Les données personnelles collectées sur ce site sont traitées conformément à notre Politique de Confidentialité et au RGPD.'
      },
      cookies: {
        title: 'Cookies',
        content: 'Ce site utilise des cookies essentiels pour son fonctionnement. En utilisant ce site, vous acceptez l\'utilisation de cookies.'
      },
      applicable: {
        title: 'Droit Applicable',
        content: 'Ces mentions légales sont régies par le droit français. Tout litige sera de la compétence exclusive des tribunaux français.'
      }
    },
    about: {
      title: 'À Propos de DotsDaily',
      subtitle: 'Visualise ton temps, suis ta progression, reste motivé.',
      mission: {
        title: 'Notre Mission',
        content: 'DotsDaily a été créé avec une mission simple : rendre le temps visible et la progression tangible. Nous croyons que voir ta progression quotidienne peut transformer ta motivation et t\'aider à atteindre tes objectifs.'
      },
      story: {
        title: 'Notre Histoire',
        content1: 'L\'idée de DotsDaily est née d\'une simple observation : nous regardons tous nos téléphones des dizaines de fois par jour. Et si chaque regard pouvait te rappeler le temps qui passe et la progression que tu fais ?',
        content2: 'Nous avons construit DotsDaily pour être simple, élégant et efficace. Pas d\'application à télécharger, pas d\'abonnement forcé, juste une URL magique qui génère ton fond d\'écran personnalisé chaque jour.'
      },
      why: {
        title: 'Pourquoi DotsDaily ?',
        simple: {
          title: 'Simplicité',
          content: 'Une URL, Raccourcis Apple, et c\'est tout. Pas d\'app, pas de complications.'
        },
        effective: {
          title: 'Efficacité',
          content: 'Voir ta progression chaque fois que tu déverrouilles ton téléphone.'
        },
        private: {
          title: 'Privé',
          content: 'Tes données te restent privées. Nous ne suivons pas, ne vendons pas.'
        },
        free: {
          title: 'Gratuit',
          content: 'Les fonctionnalités essentielles sont et resteront toujours gratuites.'
        }
      },
      community: {
        title: 'Rejoins Notre Communauté',
        content: 'DotsDaily est utilisé par des milliers de personnes qui veulent visualiser leur temps et suivre leurs objectifs. Rejoins-nous et transforme ton écran d\'accueil en outil de motivation quotidien.',
        contact: 'Des questions ou des suggestions ? Contacte-nous à'
      }
    },
    faq: {
      title: 'Questions Fréquentes',
      subtitle: 'Tout ce que tu dois savoir sur DotsDaily',
      q6: {
        q: 'Puis-je utiliser plusieurs fonds d\'écran différents ?',
        a: 'Oui ! Tu peux générer autant d\'URLs que tu veux avec différents paramètres. Tu peux même créer différentes automatisations dans Raccourcis Apple pour alterner entre plusieurs fonds d\'écran.'
      },
      q7: {
        q: 'Le fond d\'écran fonctionne-t-il hors ligne ?',
        a: 'Une fois téléchargé par Raccourcis Apple, l\'image est stockée localement sur ton téléphone. Cependant, pour obtenir la mise à jour quotidienne, ton téléphone doit être connecté à Internet.'
      },
      q8: {
        q: 'Quelles sont les différences entre Gratuit et Premium ?',
        a: 'Le plan gratuit inclut tous les modes (année, vie, objectif), tous les modèles d\'iPhone, et les thèmes. Le Premium ajoute du texte personnalisé, le groupement par trimestre, une pipette de couleurs, et la couleur des points personnalisable.'
      },
      q9: {
        q: 'Puis-je obtenir un remboursement ?',
        a: 'Les remboursements sont possibles dans les 14 jours suivant l\'achat. Contacte-nous à contact@dotsdaily.app avec ta demande.'
      },
      q10: {
        q: 'Les fonds d\'écran sont-ils optimisés pour tous les modèles d\'iPhone ?',
        a: 'Oui ! Nous supportons tous les modèles d\'iPhone récents avec les résolutions exactes pour chaque appareil, assurant un affichage parfait sans déformation.'
      },
      q11: {
        q: 'Mon automatisation affiche une erreur CFNetwork -1001.',
        a: 'L\'erreur CFNetwork -1001 est un timeout réseau. Cela signifie que ton iPhone n\'a pas pu télécharger le fond d\'écran à l\'heure prévue. Causes possibles : pas de connexion Internet, mode économie d\'énergie activé, ou serveur temporairement lent. Solution : assure-toi que ton iPhone est connecté au WiFi la nuit, ou lance manuellement l\'automation dans Raccourcis pour forcer la mise à jour.'
      },
      q12: {
        q: 'Mon automatisation ne fonctionne pas, que faire ?',
        a: 'Si tu viens d\'installer l\'app Raccourcis ou de créer l\'automatisation, tu dois attendre 2-3 jours pour qu\'elle fonctionne correctement. C\'est une limitation d\'iOS qui empêche les nouvelles automatisations de s\'exécuter immédiatement. Sois patient, elle fonctionnera automatiquement après ce délai.'
      },
      stillQuestions: 'Tu as encore des questions ?',
      contactUs: 'N\'hésite pas à nous contacter, nous sommes là pour t\'aider !'
    },
    contact: {
      title: 'Contacte-Nous',
      subtitle: 'Une question, une suggestion, un problème ? Nous sommes là pour t\'aider.',
      form: {
        name: 'Nom',
        namePlaceholder: 'Ton nom',
        email: 'Email',
        emailPlaceholder: 'ton@email.com',
        subject: 'Sujet',
        subjectPlaceholder: 'De quoi s\'agit-il ?',
        message: 'Message',
        messagePlaceholder: 'Écris ton message ici...',
        send: 'Envoyer le Message',
        sending: 'Envoi en cours...'
      },
      success: {
        title: 'Message Envoyé !',
        message: 'Nous avons bien reçu ton message et te répondrons dans les plus brefs délais.',
        sendAnother: 'Envoyer un Autre Message'
      },
      error: 'Une erreur est survenue. Réessaye ou contacte-nous directement par email.',
      alternative: 'Tu peux aussi nous écrire directement à :'
    }
  },
  en: {
    wallpaper: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
      timeRemaining: {
        days: 'd left',
        weeks: 'w left',
        months: 'm left',
        years: 'y left'
      }
    },
    config: {
      title: 'Configuration',
      iphoneModel: 'iPhone Model',
      dots: 'Dots',
      group: 'Group',
      background: 'Background',
      premium: 'Premium',
      blackBackground: 'Black background',
      whiteBackground: 'White background',
      customColor: 'Custom color',
      customImage: 'Custom image',
      dotColor: 'Dot color',
      orangeDefault: 'Orange (default)',
      shape: 'Shape',
      circle: 'Circle',
      square: 'Square',
      heart: 'Heart',
      customText: 'Custom text',
      additionalDisplay: 'Additional display',
      showPercentage: 'Show percentage',
      timeRemaining: 'Time remaining',
      noDisplay: 'No additional display',
      nothing: 'Nothing',
      birthDate: 'Birth date',
      lifeExpectancy: 'Life expectancy (years)',
      startDate: 'Start date',
      targetDate: 'Target date',
      yearInfo: 'Displays the progress in the current year with the chosen granularity.',
      granularity: {
        day: 'Day',
        week: 'Week',
        month: 'Month',
        year: 'Year'
      },
      grouping: {
        none: 'None',
        month: 'Month',
        quarter: 'Quarter'
      },
      imageMaxSize: 'Max 3 MB',
      imageErrors: {
        tooLarge: 'Image too large. Please use an image smaller than 3 MB.',
        invalidFormat: 'Invalid image format. Please use JPEG, PNG, or WebP.',
        dataTooLarge: 'Image data too large after encoding. Please use a smaller or more compressed image.',
        readError: 'Failed to read image file. Please try another image.'
      }
    },
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
        period: 'lifetime',
        badge: 'Popular',
        description: 'Unlock all features with a one-time payment.',
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
        title: 'Your life.\nOne dot at a time.',
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
          desc: 'Track every day of the year with a visual dot calendar. See your progress through 2026 at a glance.'
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
      title: 'Updates every day.',
      subtitle: 'Minimal. No app. No notifications.',
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
        title: 'Set it once',
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
          step3: 'New automation',
          step4: 'Add "Get Contents of URL" → paste your URL',
          step5: 'Add "Set Wallpaper"',
          step6: '> → Disable "Crop to Subject" and "Show Preview"',
          step7: 'Run with the ▶︎ button at bottom right',
          note: 'Your wallpaper will update automatically every day at midnight in your timezone.'
        }
      }
    },
    footer: {
      tagline: 'Turn your time, goals, and life progress into a daily-updating iPhone wallpaper powered by a simple PNG URL and Apple Shortcuts.',
      product: 'Product',
      support: 'Support',
      legal: 'Legal',
      generator: 'Generator',
      features: 'Features',
      howItWorks: 'How It Works',
      faq: 'FAQ',
      contact: 'Contact',
      about: 'About',
      privacy: 'Privacy',
      terms: 'Terms',
      legalNotice: 'Legal Notice',
      rights: 'All rights reserved.'
    },
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: January 26, 2026',
      intro: {
        title: 'Introduction',
        content: 'At DotsDaily, we take your privacy seriously. This privacy policy explains how we collect, use, and protect your personal information when you use our service.'
      },
      dataCollected: {
        title: 'Data Collected',
        intro: 'We collect the following information:',
        item1: 'Account information (email, name) if you create an account',
        item2: 'Wallpaper configuration settings (dates, colors, preferences)',
        item3: 'Payment information via Stripe for premium access',
        item4: 'Usage data and analytics to improve our service'
      },
      howWeUse: {
        title: 'How We Use Your Data',
        item1: 'Generate and provide your personalized wallpapers',
        item2: 'Manage your account and preferences',
        item3: 'Process payments',
        item4: 'Improve our service and develop new features'
      },
      dataStorage: {
        title: 'Data Storage',
        content: 'All your data is securely stored on Supabase, a GDPR-compliant database platform. We use end-to-end encryption to protect your information.'
      },
      cookies: {
        title: 'Cookies',
        content: 'We use essential cookies to maintain your session and remember your language preferences. No third-party tracking cookies are used.'
      },
      rights: {
        title: 'Your Rights',
        item1: 'Access your personal data',
        item2: 'Rectify or delete your data',
        item3: 'Export your data',
        item4: 'Object to data processing'
      },
      security: {
        title: 'Security',
        content: 'We implement appropriate technical and organizational security measures to protect your data against unauthorized access, modification, disclosure, or destruction.'
      },
      changes: {
        title: 'Changes',
        content: 'We may update this policy from time to time. We will notify you of any significant changes by email or through a notification on the site.'
      },
      contact: {
        title: 'Contact',
        content: 'For any questions regarding this privacy policy, contact us at'
      }
    },
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'Last updated: January 26, 2026',
      acceptance: {
        title: 'Acceptance of Terms',
        content: 'By using DotsDaily, you agree to these terms of service. If you do not agree with these terms, do not use our service.'
      },
      service: {
        title: 'Service Description',
        content: 'DotsDaily provides an automatically-updating iPhone wallpaper generation service. The service is accessible via a PNG URL and works with Apple Shortcuts.'
      },
      account: {
        title: 'User Account',
        item1: 'You are responsible for maintaining the confidentiality of your account',
        item2: 'You must provide accurate and up-to-date information',
        item3: 'You are responsible for all activity on your account'
      },
      usage: {
        title: 'Acceptable Use',
        intro: 'You agree not to:',
        item1: 'Use the service for illegal purposes',
        item2: 'Attempt to disrupt or overload our servers',
        item3: 'Copy, modify, or distribute our content without permission',
        item4: 'Use bots or automated scripts without permission'
      },
      intellectual: {
        title: 'Intellectual Property',
        content: 'DotsDaily and all its content are protected by copyright laws. Generated wallpapers belong to you, but our platform and technology remain our property.'
      },
      payment: {
        title: 'Payments',
        content: 'Premium access is a one-time payment of €2.99 via Stripe that gives you lifetime access to premium features. Refunds are processed on a case-by-case basis within 14 days of purchase.'
      },
      limitation: {
        title: 'Limitation of Liability',
        content: 'DotsDaily is provided "as is" without warranty. We are not responsible for damages resulting from the use or inability to use our service.'
      },
      termination: {
        title: 'Termination',
        content: 'We reserve the right to suspend or terminate your account in case of violation of these terms.'
      },
      changes: {
        title: 'Changes',
        content: 'We may modify these terms at any time. Changes take effect upon publication.'
      },
      contact: {
        title: 'Contact',
        content: 'For any questions regarding these terms, contact us at'
      }
    },
    legal: {
      title: 'Legal Notice',
      subtitle: 'Legal information in accordance with the law',
      publisher: {
        title: 'Site Publisher',
        name: 'Name',
        email: 'Email',
        website: 'Website'
      },
      hosting: {
        title: 'Hosting',
        provider: 'Provider',
        address: 'Address',
        website: 'Website'
      },
      database: {
        title: 'Database',
        provider: 'Provider',
        website: 'Website'
      },
      intellectual: {
        title: 'Intellectual Property',
        content: 'All content on this site (texts, images, logos, design) is the property of DotsDaily and is protected by intellectual property laws.'
      },
      personal: {
        title: 'Personal Data',
        content: 'Personal data collected on this site is processed in accordance with our Privacy Policy and GDPR.'
      },
      cookies: {
        title: 'Cookies',
        content: 'This site uses essential cookies for its operation. By using this site, you accept the use of cookies.'
      },
      applicable: {
        title: 'Applicable Law',
        content: 'These legal notices are governed by French law. Any dispute will be under the exclusive jurisdiction of French courts.'
      }
    },
    about: {
      title: 'About DotsDaily',
      subtitle: 'Visualize your time, track your progress, stay motivated.',
      mission: {
        title: 'Our Mission',
        content: 'DotsDaily was created with a simple mission: make time visible and progress tangible. We believe that seeing your daily progress can transform your motivation and help you achieve your goals.'
      },
      story: {
        title: 'Our Story',
        content1: 'The idea for DotsDaily was born from a simple observation: we all look at our phones dozens of times a day. What if every glance could remind you of time passing and the progress you\'re making?',
        content2: 'We built DotsDaily to be simple, elegant, and effective. No app to download, no forced subscription, just a magic URL that generates your personalized wallpaper every day.'
      },
      why: {
        title: 'Why DotsDaily?',
        simple: {
          title: 'Simplicity',
          content: 'One URL, Apple Shortcuts, and that\'s it. No app, no complications.'
        },
        effective: {
          title: 'Effectiveness',
          content: 'See your progress every time you unlock your phone.'
        },
        private: {
          title: 'Private',
          content: 'Your data stays private. We don\'t track, we don\'t sell.'
        },
        free: {
          title: 'Free',
          content: 'Essential features are and will always remain free.'
        }
      },
      community: {
        title: 'Join Our Community',
        content: 'DotsDaily is used by thousands of people who want to visualize their time and track their goals. Join us and transform your home screen into a daily motivation tool.',
        contact: 'Questions or suggestions? Contact us at'
      }
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about DotsDaily',
      q6: {
        q: 'Can I use multiple different wallpapers?',
        a: 'Yes! You can generate as many URLs as you want with different settings. You can even create different automations in Apple Shortcuts to alternate between multiple wallpapers.'
      },
      q7: {
        q: 'Does the wallpaper work offline?',
        a: 'Once downloaded by Apple Shortcuts, the image is stored locally on your phone. However, to get the daily update, your phone must be connected to the Internet.'
      },
      q8: {
        q: 'What are the differences between Free and Premium?',
        a: 'The free plan includes all modes (year, life, goal), all iPhone models, and themes. Premium adds custom text, quarterly grouping, a color picker, and customizable dot color.'
      },
      q9: {
        q: 'Can I get a refund?',
        a: 'Refunds are possible within 14 days of purchase. Contact us at contact@dotsdaily.app with your request.'
      },
      q10: {
        q: 'Are wallpapers optimized for all iPhone models?',
        a: 'Yes! We support all recent iPhone models with exact resolutions for each device, ensuring perfect display without distortion.'
      },
      q11: {
        q: 'My automation shows a CFNetwork -1001 error.',
        a: 'CFNetwork -1001 is a network timeout error. This means your iPhone couldn\'t download the wallpaper at the scheduled time. Possible causes: no Internet connection, low power mode enabled, or temporarily slow server. Solution: make sure your iPhone is connected to WiFi at night, or manually run the automation in Shortcuts to force the update.'
      },
      q12: {
        q: 'My automation isn\'t working, what should I do?',
        a: 'If you just installed the Shortcuts app or created the automation, you need to wait 2-3 days for it to work properly. This is an iOS limitation that prevents new automations from running immediately. Be patient, it will work automatically after this delay.'
      },
      stillQuestions: 'Still have questions?',
      contactUs: 'Feel free to contact us, we\'re here to help!'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'A question, suggestion, or problem? We\'re here to help.',
      form: {
        name: 'Name',
        namePlaceholder: 'Your name',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        subject: 'Subject',
        subjectPlaceholder: 'What is this about?',
        message: 'Message',
        messagePlaceholder: 'Write your message here...',
        send: 'Send Message',
        sending: 'Sending...'
      },
      success: {
        title: 'Message Sent!',
        message: 'We received your message and will respond as soon as possible.',
        sendAnother: 'Send Another Message'
      },
      error: 'An error occurred. Please try again or contact us directly by email.',
      alternative: 'You can also write to us directly at:'
    }
  }
};
