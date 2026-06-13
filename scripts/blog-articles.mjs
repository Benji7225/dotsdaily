// Source de vérité du blog SEO de DotsDaily.
// Chaque passage de nuit peut AJOUTER des articles ici, puis lancer
// `node scripts/generate-blog.mjs` pour régénérer les pages statiques + le sitemap.
//
// Forme d'un article :
//   slug, title, description, date (YYYY-MM-DD), keywords,
//   intro (HTML inline simple),
//   sections: [{ h2, blocks: [{p} | {ul:[...]} | {ol:[...]}] }]
//
// Le contenu est en anglais (le site est en lang="en", audience mondiale).

export const SITE = {
  base: 'https://dotsdaily.app',
  name: 'DotsDaily',
  logo: '/dotsdaily_logo.webp',
  tagline: 'Daily-updating iPhone wallpapers that show your life, year and goals.',
};

export const articles = [
  {
    slug: 'auto-change-iphone-wallpaper-daily',
    title: 'How to Auto-Change Your iPhone Wallpaper Every Day (No App Needed)',
    description:
      'Set your iPhone to refresh its wallpaper automatically every morning with Apple Shortcuts and DotsDaily. Step by step, no jailbreak, no paid app.',
    date: '2026-06-13',
    keywords:
      'auto change iphone wallpaper, daily wallpaper iphone, change wallpaper automatically, apple shortcuts wallpaper, iphone wallpaper automation',
    intro:
      'A wallpaper you never change becomes invisible within a day. A wallpaper that updates every morning stays alive, and it can quietly show you something useful: how much of the year is left, how close a goal is, or a line that gets you moving. Here is how to make your iPhone change its wallpaper on its own, every single day, for free.',
    sections: [
      {
        h2: 'Why a daily wallpaper actually works',
        blocks: [
          { p: 'Your lock screen is the most-seen screen in your life. People check their phone 50 to 90 times a day. A static image gets filtered out by your brain almost immediately. A picture that changes keeps catching your eye, and that tiny bit of novelty is enough to make a message land.' },
          { p: 'The trick is to put something on it that compounds: a progress bar, a countdown, or a rotating quote. Then every glance becomes a nudge instead of decoration.' },
        ],
      },
      {
        h2: 'What you need',
        blocks: [
          { ul: [
            'An iPhone running iOS 16 or later (the Shortcuts automation for wallpaper works best here).',
            'The free Shortcuts app (pre-installed on every iPhone).',
            'A wallpaper image that is generated fresh each day, like the ones from the DotsDaily generator.',
          ] },
        ],
      },
      {
        h2: 'Step by step with Apple Shortcuts',
        blocks: [
          { ol: [
            'Generate your wallpaper on DotsDaily and copy your personal image link (it returns a new image each day at the same URL).',
            'Open Shortcuts, go to the Automation tab, and create a new Personal Automation.',
            'Choose "Time of Day" and set it to something like 7:00 AM, repeating daily.',
            'Add the action "Get Contents of URL" and paste your DotsDaily image link.',
            'Add the action "Set Wallpaper" and point it at the downloaded image.',
            'Turn off "Ask Before Running" so it happens silently every morning.',
          ] },
          { p: 'That is it. From tomorrow on, your phone pulls a fresh wallpaper before you even pick it up.' },
        ],
      },
      {
        h2: 'Make it show something that matters',
        blocks: [
          { p: 'A daily wallpaper is only powerful if it carries a signal. The combinations people keep coming back to are a year progress bar, a life calendar in weeks, a countdown to a specific date, and a rotating set of short quotes. DotsDaily lets you stack these on one clean wallpaper and pick your own colors so it still looks good on your home screen.' },
        ],
      },
    ],
    cta: 'Build your daily wallpaper',
  },

  {
    slug: 'year-progress-bar-wallpaper',
    title: 'Year Progress Bar Wallpaper: Watch the Year Tick By on Your Lock Screen',
    description:
      'A year progress bar turns abstract time into a number you actually feel. Here is why it changes behavior and how to put one on your iPhone for free.',
    date: '2026-06-13',
    keywords:
      'year progress bar, year progress wallpaper, time progress iphone, year percentage wallpaper, motivation wallpaper',
    intro:
      'At any moment, the current year is some percent complete, and most people have no idea what that number is. Put it on your lock screen and something shifts: time stops being a vague feeling and becomes a bar that fills up whether you act or not.',
    sections: [
      {
        h2: 'Why a percentage beats a calendar',
        blocks: [
          { p: 'A calendar shows you days. A progress bar shows you depletion. "It is 47% through the year" hits differently than "it is mid-June", because it frames the time as a finite resource that is already half gone. That mild urgency is exactly what gets a stalled goal moving again.' },
          { p: 'It also removes the planning fallacy. When you can see that two thirds of the year is gone and your goal is barely started, you adjust faster than any monthly review would make you.' },
        ],
      },
      {
        h2: 'What to track besides the year',
        blocks: [
          { ul: [
            'Quarter progress, if you run your work in 90-day cycles.',
            'A countdown to a launch, a trip, an exam, or a birthday.',
            'Your age in weeks or your life expectancy bar, for the long view.',
            'A custom goal deadline, so the bar maps to your project, not the calendar.',
          ] },
        ],
      },
      {
        h2: 'How to set it up',
        blocks: [
          { p: 'Open the DotsDaily generator, turn on the year progress element, choose your iPhone model so it fits your screen perfectly, and pick a background and dot color you like. Then follow the daily automation so the percentage updates itself every morning. You set it once and forget it; the bar keeps moving.' },
        ],
      },
    ],
    cta: 'Make your year progress wallpaper',
  },

  {
    slug: 'life-calendar-wallpaper',
    title: 'The Life Calendar Wallpaper: Your Life in Weeks, on Your Lock Screen',
    description:
      'Inspired by "Your Life in Weeks", a life calendar wallpaper shows the weeks you have lived and the ones left. Why it is so effective, and how to set one up on iPhone.',
    date: '2026-06-13',
    keywords:
      'life calendar, life in weeks, life calendar wallpaper, memento mori wallpaper, weeks of your life',
    intro:
      'A life calendar draws every week of a human life as a single dot, roughly 4,000 of them. Fill in the weeks you have already lived and the grid stops being a chart. It becomes the most honest reminder you will ever carry: time is limited, and a lot of it is already spent.',
    sections: [
      {
        h2: 'Where the idea comes from',
        blocks: [
          { p: 'The "Your Life in Weeks" grid was popularized by Tim Urban, building on the old idea of memento mori, remembering that you will die. Seeing a life as 4,000 dots, with maybe 1,500 already filled, does in one glance what a hundred motivational posts cannot: it makes the scarcity real.' },
        ],
      },
      {
        h2: 'Why it belongs on a wallpaper',
        blocks: [
          { p: 'A life calendar printed on a poster gets ignored after a week. On a lock screen you see it dozens of times a day, every day. It quietly reframes small decisions. The hour you were about to lose feels more expensive when the dots are right there.' },
          { ul: [
            'It cuts procrastination by making "later" feel finite.',
            'It puts a bad day in perspective, since it is one dot among thousands.',
            'It nudges you toward the few things you would regret not doing.',
          ] },
        ],
      },
      {
        h2: 'Set up your life calendar on iPhone',
        blocks: [
          { p: 'In the DotsDaily generator, enter your birth date, choose the life calendar layout, and pick a clean background. The grid fills to today and updates automatically when you use the daily Shortcuts automation. Pair it with a single short quote if you want a softer version that motivates more than it haunts.' },
        ],
      },
    ],
    cta: 'Create your life calendar wallpaper',
  },

  {
    slug: 'motivational-lock-screen-quotes',
    title: '50 Short Motivational Lock Screen Quotes That Actually Stick',
    description:
      'The best short quotes for your iPhone lock screen, sorted by mood: discipline, focus, calm and ambition. Plus how to rotate a new one automatically every day.',
    date: '2026-06-13',
    keywords:
      'lock screen quotes, motivational wallpaper quotes, short quotes iphone, discipline quotes wallpaper, daily quote wallpaper',
    intro:
      'A long quote on a wallpaper never gets read. A short one, three or four words, gets absorbed before you even unlock. The strongest lock screen quotes are commands, not paragraphs. Here are the ones that hold up, grouped by the mood you want to trigger.',
    sections: [
      {
        h2: 'Discipline and grind',
        blocks: [
          { ul: ['do it anyway.', 'no excuses.', 'discipline > mood.', 'one more rep.', 'earn the body.', 'stay hard.'] },
        ],
      },
      {
        h2: 'Focus and deep work',
        blocks: [
          { ul: ['lock in.', 'deep work.', 'finish this.', 'focus.', 'one thing at a time.', 'close the tabs.'] },
        ],
      },
      {
        h2: 'Calm and anxiety',
        blocks: [
          { ul: ['breathe.', 'you are safe.', 'it will pass.', 'stay present.', 'protect your peace.', 'one step.'] },
        ],
      },
      {
        h2: 'Confidence and ambition',
        blocks: [
          { ul: ['i am capable.', 'watch me.', 'think bigger.', 'build the life.', 'stay hungry.', 'execute.'] },
        ],
      },
      {
        h2: 'Why rotating beats a single quote',
        blocks: [
          { p: 'Any quote loses its punch once your brain memorizes it. The fix is rotation: a different line every day so it never becomes wallpaper noise. DotsDaily ships with curated quote packs by mood and lets you paste your own, then serves a new one each morning through the daily automation.' },
        ],
      },
    ],
    cta: 'Get a new quote on your wallpaper daily',
  },
];
