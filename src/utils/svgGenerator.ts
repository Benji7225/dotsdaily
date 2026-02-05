import { WallpaperConfig } from '../pages/Generator';

interface ModelSpecs {
  width: number;
  height: number;
  safeArea: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

interface Translations {
  months: string[];
  quarters: string[];
  timeRemaining: {
    days: string;
    weeks: string;
    months: string;
    years: string;
  };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getWeekOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil(diff / oneWeek);
}

interface GroupInfo {
  startIndex: number;
  endIndex: number;
  label: string;
  count: number;
  firstDayOfWeek?: number;
  isCalendarLayout?: boolean;
}

function calculateGroups(config: WallpaperConfig, total: number, translations: Translations): GroupInfo[] {
  if (!config.grouping || config.grouping === 'none' || config.mode !== 'year') {
    return [];
  }

  const groups: GroupInfo[] = [];

  if (config.granularity === 'day') {
    if (config.grouping === 'month') {
      const monthNames = translations.months;
      const now = new Date();
      const year = now.getFullYear();
      let dayIndex = 0;

      for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1);
        const dayOfWeek = firstDay.getDay();
        const firstDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        groups.push({
          startIndex: dayIndex,
          endIndex: dayIndex + daysInMonth - 1,
          label: monthNames[month],
          count: daysInMonth,
          firstDayOfWeek: firstDayOfWeek,
          isCalendarLayout: true
        });
        dayIndex += daysInMonth;
      }
    } else if (config.grouping === 'quarter') {
      const quarters = translations.quarters;
      const now = new Date();
      const year = now.getFullYear();
      let dayIndex = 0;

      for (let q = 0; q < 4; q++) {
        const startMonth = q * 3;
        let daysInQuarter = 0;
        for (let m = 0; m < 3; m++) {
          daysInQuarter += new Date(year, startMonth + m + 1, 0).getDate();
        }
        groups.push({
          startIndex: dayIndex,
          endIndex: dayIndex + daysInQuarter - 1,
          label: quarters[q],
          count: daysInQuarter
        });
        dayIndex += daysInQuarter;
      }
    } else if (config.grouping === 'week') {
      const weeksInYear = 52;
      for (let week = 0; week < weeksInYear; week++) {
        const startDay = week * 7;
        const endDay = Math.min(startDay + 6, total - 1);
        if (startDay < total) {
          groups.push({
            startIndex: startDay,
            endIndex: endDay,
            label: `S${week + 1}`,
            count: endDay - startDay + 1
          });
        }
      }
    }
  } else if (config.granularity === 'week') {
    if (config.grouping === 'month') {
      const monthNames = translations.months;
      let weekIndex = 0;

      for (let month = 0; month < 12; month++) {
        const weeksInMonth = month === 1 ? 4 : (month % 2 === 0 ? 5 : 4);
        const actualWeeks = Math.min(weeksInMonth, total - weekIndex);
        if (actualWeeks > 0) {
          groups.push({
            startIndex: weekIndex,
            endIndex: weekIndex + actualWeeks - 1,
            label: monthNames[month],
            count: actualWeeks
          });
          weekIndex += actualWeeks;
        }
      }
    } else if (config.grouping === 'quarter') {
      const quarters = translations.quarters;
      const weeksPerQuarter = 13;

      for (let q = 0; q < 4; q++) {
        const startWeek = q * weeksPerQuarter;
        const endWeek = Math.min(startWeek + weeksPerQuarter - 1, total - 1);
        if (startWeek < total) {
          groups.push({
            startIndex: startWeek,
            endIndex: endWeek,
            label: quarters[q],
            count: endWeek - startWeek + 1
          });
        }
      }
    }
  }

  return groups;
}

function calculateProgress(config: WallpaperConfig, translations: Translations): { current: number; total: number; label: string } {
  const now = new Date();

  switch (config.mode) {
    case 'year': {
      if (config.granularity === 'day') {
        const dayOfYear = getDayOfYear(now);
        const daysInYear = isLeapYear(now.getFullYear()) ? 366 : 365;
        const daysLeft = daysInYear - dayOfYear;
        return {
          current: dayOfYear,
          total: daysInYear,
          label: `${daysLeft} ${translations.timeRemaining.days}`
        };
      } else if (config.granularity === 'week') {
        const weekOfYear = getWeekOfYear(now);
        const weeksInYear = 52;
        const weeksLeft = weeksInYear - weekOfYear;
        return {
          current: weekOfYear,
          total: weeksInYear,
          label: `${weeksLeft} ${translations.timeRemaining.weeks}`
        };
      }
      break;
    }


    case 'life': {
      if (!config.birthDate) {
        throw new Error('birthDate required for life mode');
      }
      const birth = new Date(config.birthDate);
      const expectancy = config.lifeExpectancy || 80;

      if (config.granularity === 'year') {
        const ageInYears = now.getFullYear() - birth.getFullYear();
        const yearsLeft = Math.max(0, expectancy - ageInYears);
        return {
          current: Math.min(ageInYears, expectancy),
          total: expectancy,
          label: `${yearsLeft} ${translations.timeRemaining.years}`
        };
      } else if (config.granularity === 'month') {
        const ageInMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
        const totalMonths = expectancy * 12;
        const monthsLeft = Math.max(0, totalMonths - ageInMonths);
        return {
          current: Math.min(ageInMonths, totalMonths),
          total: totalMonths,
          label: `${monthsLeft} ${translations.timeRemaining.months}`
        };
      } else if (config.granularity === 'week') {
        const ageInWeeks = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 7));
        const totalWeeks = expectancy * 52;
        const weeksLeft = Math.max(0, totalWeeks - ageInWeeks);
        return {
          current: Math.min(ageInWeeks, totalWeeks),
          total: totalWeeks,
          label: `${weeksLeft} ${translations.timeRemaining.weeks}`
        };
      }
      break;
    }

    case 'countdown': {
      if (!config.targetDate) {
        throw new Error('targetDate required for countdown mode');
      }
      const target = new Date(config.targetDate);
      const start = config.startDate ? new Date(config.startDate) : new Date();

      if (config.granularity === 'day') {
        const totalDays = Math.ceil((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const daysElapsed = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))) + 1;
        const daysLeft = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        return {
          current: Math.min(daysElapsed, totalDays),
          total: totalDays,
          label: `${daysLeft} ${translations.timeRemaining.days}`
        };
      } else if (config.granularity === 'week') {
        const totalWeeks = Math.ceil((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7));
        const weeksElapsed = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7))) + 1;
        const weeksLeft = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7)));
        return {
          current: Math.min(weeksElapsed, totalWeeks),
          total: totalWeeks,
          label: `${weeksLeft} ${translations.timeRemaining.weeks}`
        };
      } else if (config.granularity === 'month') {
        const totalMonths = Math.ceil((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
        const monthsElapsed = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))) + 1;
        const monthsLeft = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
        return {
          current: Math.min(monthsElapsed, totalMonths),
          total: totalMonths,
          label: `${monthsLeft} ${translations.timeRemaining.months}`
        };
      } else if (config.granularity === 'year') {
        const totalYears = Math.ceil((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
        const yearsElapsed = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365))) + 1;
        const yearsLeft = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365)));
        return {
          current: Math.min(yearsElapsed, totalYears),
          total: totalYears,
          label: `${yearsLeft} ${translations.timeRemaining.years}`
        };
      }
      break;
    }

    default:
      throw new Error('Invalid mode');
  }

  throw new Error('Invalid granularity for mode');
}

function generateDotShape(x: number, y: number, size: number, fill: string, shape?: string): string {
  const dotShape = shape || 'circle';

  switch (dotShape) {
    case 'square': {
      const halfSize = size / 2;
      return `<rect x="${x - halfSize}" y="${y - halfSize}" width="${size}" height="${size}" fill="${fill}" rx="${size * 0.15}" />`;
    }
    case 'heart': {
      const scale = size / 20;
      const heartPath = 'M10,6 C10,3.8 8.2,2 6,2 C3.8,2 2,3.8 2,6 C2,10 6,14 10,18 C14,14 18,10 18,6 C18,3.8 16.2,2 14,2 C11.8,2 10,3.8 10,6 Z';
      return `<path d="${heartPath}" fill="${fill}" transform="translate(${x - 10 * scale}, ${y - 10 * scale}) scale(${scale})" />`;
    }
    case 'circle':
    default:
      return `<circle cx="${x}" cy="${y}" r="${size / 2}" fill="${fill}" />`;
  }
}

function generateQuoteSVG(config: WallpaperConfig, modelSpecs: ModelSpecs, dayOffset: number = 0): string {
  const { width, height, safeArea } = modelSpecs;
  const isDark = config.theme !== 'light';

  let bgColor = isDark ? '#0a0a0a' : '#ffffff';
  let backgroundDef = '';

  if (config.themeType === 'custom' && config.customColor) {
    bgColor = config.customColor;
  } else if (config.themeType === 'image' && config.backgroundImage) {
    backgroundDef = `<defs>
      <pattern id="bgImage" x="0" y="0" width="1" height="1">
        <image href="${config.backgroundImage}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>
      </pattern>
    </defs>`;
    bgColor = 'url(#bgImage)';
  }

  const quotesByCategory: Record<string, string[]> = {
    discipline: [
      "do it anyway.",
      "no excuses.",
      "stay consistent.",
      "show up.",
      "keep going.",
      "finish the day.",
      "start again.",
      "earn it.",
      "keep your word.",
      "no zero days.",
      "discipline > mood.",
      "repeat.",
      "be reliable."
    ],
    self_respect: [
      "respect yourself.",
      "choose yourself.",
      "protect your peace.",
      "stop begging.",
      "raise your standards.",
      "don't chase.",
      "walk away.",
      "stay private.",
      "keep boundaries.",
      "you deserve better.",
      "self respect first."
    ],
    confidence: [
      "i am capable.",
      "i trust myself.",
      "i'm built for this.",
      "i can handle it.",
      "i am enough.",
      "i belong here.",
      "calm confidence.",
      "prove it.",
      "i don't fold.",
      "watch me.",
      "i will win."
    ],
    calm: [
      "breathe.",
      "slow down.",
      "you are safe.",
      "one step.",
      "not today.",
      "stay present.",
      "be here now.",
      "let it go.",
      "calm mind.",
      "it will pass.",
      "no panic.",
      "keep it simple."
    ],
    heartbreak: [
      "let them go.",
      "choose peace.",
      "stop checking.",
      "don't look back.",
      "heal quietly.",
      "you'll be okay.",
      "detach.",
      "it's over.",
      "move forward.",
      "new chapter.",
      "you deserve love.",
      "never again."
    ],
    love: [
      "i love you.",
      "i'm proud of you.",
      "you're my home.",
      "good morning, love.",
      "i'm here.",
      "i choose you.",
      "always you.",
      "stay with me.",
      "i'm yours.",
      "you matter.",
      "you're safe with me."
    ],
    ambition: [
      "build the life.",
      "think bigger.",
      "stay hungry.",
      "no comfort.",
      "make it real.",
      "get to work.",
      "stack it.",
      "be unstoppable.",
      "play the long game.",
      "execute.",
      "move in silence.",
      "no shortcuts."
    ],
    gym: [
      "one more rep.",
      "earn the body.",
      "no days off.",
      "train today.",
      "don't quit.",
      "pain is temporary.",
      "stay hard.",
      "do the work.",
      "sweat first.",
      "stronger daily.",
      "lift heavy."
    ],
    focus: [
      "focus.",
      "lock in.",
      "deep work.",
      "no distractions.",
      "study now.",
      "future you.",
      "keep learning.",
      "do the task.",
      "finish this.",
      "one chapter.",
      "pass the exam."
    ],
    memento_mori: [
      "time is running.",
      "don't waste it.",
      "your time matters.",
      "life is short.",
      "remember death.",
      "today counts.",
      "time flies.",
      "not forever.",
      "make it count.",
      "you are aging.",
      "stop delaying."
    ]
  };

  let shortQuotes: string[] = [];

  if (config.customQuotes && config.customQuotes.length > 0) {
    shortQuotes = config.customQuotes;
  } else {
    const selectedCategories = config.quoteCategories || ['discipline'];

    for (const category of selectedCategories) {
      if (quotesByCategory[category]) {
        shortQuotes = shortQuotes.concat(quotesByCategory[category]);
      }
    }

    if (shortQuotes.length === 0) {
      shortQuotes = quotesByCategory.discipline;
    }
  }

  const now = new Date();
  const targetDate = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
  const dayOfYear = Math.floor((targetDate.getTime() - new Date(targetDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const quoteIndex = dayOfYear % shortQuotes.length;
  const quote = shortQuotes[quoteIndex];

  const textColor = isDark ? '#ffffff' : '#000000';
  const dotColor = config.dotColor || '#FF8C42';
  const dotSize = 10;

  const horizontalPadding = width * 0.2;
  const maxTextWidth = width - (2 * horizontalPadding);

  const fontSize = 28;
  const avgCharWidth = fontSize * 0.52;
  const lineHeight = fontSize * 1.5;

  function estimateTextWidth(text: string): number {
    let width = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === ' ') {
        width += avgCharWidth * 0.28;
      } else if (char.match(/[iIjl1!'|]/)) {
        width += avgCharWidth * 0.35;
      } else if (char.match(/[mMwW]/)) {
        width += avgCharWidth * 1.4;
      } else if (char.match(/[frt]/)) {
        width += avgCharWidth * 0.6;
      } else if (char.match(/[><]/)) {
        width += avgCharWidth * 1.1;
      } else {
        width += avgCharWidth;
      }
    }
    return width;
  }

  function wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = estimateTextWidth(testLine);

      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  const allLines: Array<{ text: string; hasDot: boolean }> = [];
  const quoteLines = quote.split('\n');

  for (const line of quoteLines) {
    const hasDot = line.endsWith('.');
    const textWithoutDot = hasDot ? line.slice(0, -1) : line;
    const wrappedLines = wrapText(textWithoutDot, maxTextWidth);

    wrappedLines.forEach((wrappedLine, idx) => {
      allLines.push({
        text: wrappedLine,
        hasDot: idx === wrappedLines.length - 1 && hasDot
      });
    });
  }

  const totalHeight = allLines.length * lineHeight;
  const startY = height / 2 - totalHeight / 2 + fontSize;

  const textElements = allLines.map((lineObj, index) => {
    const centerY = startY + index * lineHeight;

    if (lineObj.hasDot) {
      return `<text x="${width / 2}" y="${centerY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="${fontSize}" font-weight="500" fill="${textColor}" text-anchor="middle">${lineObj.text}<tspan font-size="${fontSize * 1.4}" fill="${dotColor}">.</tspan></text>`;
    }
    return `<text x="${width / 2}" y="${centerY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="${fontSize}" font-weight="500" fill="${textColor}" text-anchor="middle">${lineObj.text}</text>`;
  }).join('\n  ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  ${backgroundDef}
  <rect width="${width}" height="${height}" fill="${bgColor}"/>

  ${textElements}
</svg>`;
}

export function generateSVG(config: WallpaperConfig, modelSpecs: ModelSpecs, translations: Translations, dayOffset?: number): string {
  if (config.wallpaperType === 'quotes') {
    return generateQuoteSVG(config, modelSpecs, dayOffset || 0);
  }
  const { width, height, safeArea } = modelSpecs;
  const isDark = config.theme !== 'light';

  const safeTop = safeArea.top;
  const safeBottom = safeArea.bottom;
  const safeLeft = safeArea.left  ;
  const safeRight = safeArea.right;

  const { current, total, label } = calculateProgress(config, translations);
  const percentage = Math.round((current / total) * 100);

  const textTopHeight = 0;
  const textBottomHeight = 50;

  const availableWidth = width - safeLeft - safeRight;
  const availableHeight = height - safeTop - safeBottom - textTopHeight - textBottomHeight;

  let bgColor = isDark ? '#0a0a0a' : '#ffffff';
  let backgroundDef = '';

  if (config.themeType === 'custom' && config.customColor) {
    bgColor = config.customColor;
  } else if (config.themeType === 'image' && config.backgroundImage) {
    backgroundDef = `<defs>
      <pattern id="bgImage" x="0" y="0" width="1" height="1">
        <image href="${config.backgroundImage}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>
      </pattern>
    </defs>`;
    bgColor = 'url(#bgImage)';
  }

  const subTextColor = isDark ? '#999999' : '#666666';
  const labelColor = isDark ? '#666666' : '#999999';

  const percentageGapFromLastDot = 60;

  const groups = calculateGroups(config, total, translations);

  let dots = '';
  let textBottomY = height - safeBottom - 25;

  interface DotStyle {
    spacing: number;
    size: number;
  }

  const getDotStyle = (): DotStyle => {
    const key = `${config.mode}-${config.granularity}${config.grouping ? `-${config.grouping}` : ''}`;

    const styles: Record<string, DotStyle> = {
      'year-day-month': { spacing: 2.5, size: 1.5 },
      'year-day-week': { spacing: 1.6, size: 1.0 },
      'year-day-quarter': { spacing: 1.6, size: 1.0 },
      'year-day': { spacing: 1.6, size: 1.0 },
      'year-week-quarter': { spacing: 1.6, size: 1.0 },
      'year-week': { spacing: 1.6, size: 1.0 },
      'life-year': { spacing: 1.6, size: 1.0 },
      'life-month': { spacing: 1.6, size: 1.0 },
      'life-week': { spacing: 1.6, size: 1.0 },
      'countdown-day': { spacing: 1.6, size: 1.0 },
      'countdown-week': { spacing: 1.6, size: 1.0 },
      'countdown-month': { spacing: 1.6, size: 1.0 },
      'countdown-year': { spacing: 1.6, size: 1.0 }
    };

    return styles[key] || { spacing: 1.6, size: 1.0 };
  };

  const dotStyle = getDotStyle();
  const dotSpacing = dotStyle.spacing;
  const dotSizeMultiplier = dotStyle.size;

  const maxMonthDayDotSize = (() => {
    const calendarCols = 7;
    const calendarRows = 6;
    return Math.min(
      availableWidth / (calendarCols * dotSpacing),
      availableHeight / (calendarRows * dotSpacing)
    );
  })();

  if (groups.length > 0) {
    const numGroups = groups.length;
    const groupCols = config.grouping === 'week' ? 13 : (config.grouping === 'quarter' ? 2 : 3);
    const groupRows = Math.ceil(numGroups / groupCols);

    const isYearDayMonth = config.mode === 'year' && config.granularity === 'day' && config.grouping === 'month';
    const isQuarter = config.grouping === 'quarter';
    const groupSpacing = isYearDayMonth ? 5 : (isQuarter ? 10 : 100);
    const labelHeight = isYearDayMonth ? 12 : 25 ;

    const groupWidth = (availableWidth - (groupCols - 1) * groupSpacing) / groupCols;
    const groupHeight = (availableHeight - (groupRows - 1) * groupSpacing - groupRows * labelHeight) / groupRows;

    const totalGridWidth = groupCols * groupWidth + (groupCols - 1) * groupSpacing;
    const totalGridHeight = groupRows * groupHeight + (groupRows - 1) * groupSpacing + groupRows * labelHeight;

    const contentTop = safeTop + textTopHeight;
    const startX = safeLeft + (availableWidth - totalGridWidth) / 2;
    const startY = contentTop + (availableHeight - totalGridHeight) / 2;

    let globalDotSize = Infinity;

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const dotsInGroup = group.count;
      const groupDotArea = groupHeight - labelHeight;

      let dotCols: number;
      let dotRows: number;

      if (group.isCalendarLayout && group.firstDayOfWeek !== undefined) {
        dotCols = 7;
        dotRows = Math.ceil((dotsInGroup + group.firstDayOfWeek) / 7);
      } else {
        dotCols = Math.ceil(Math.sqrt(dotsInGroup * (groupWidth / groupDotArea)));
        dotRows = Math.ceil(dotsInGroup / dotCols);
      }

      const dotSize = Math.min(
        groupWidth / (dotCols * dotSpacing),
        groupDotArea / (dotRows * dotSpacing),
        maxMonthDayDotSize
      );

      globalDotSize = Math.min(globalDotSize, dotSize);
    }

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const groupRow = Math.floor(i / groupCols);
      const groupCol = i % groupCols;

      const groupX = startX + groupCol * (groupWidth + groupSpacing);
      const groupY = startY + groupRow * (groupHeight + groupSpacing + labelHeight);

      const labelY = groupY + labelHeight / 2;
      dots += `<text x="${groupX}" y="${labelY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="500" fill="${labelColor}" text-anchor="start">${group.label}</text>`;

      const dotsInGroup = group.count;
      const groupDotArea = groupHeight - labelHeight;

      let dotCols: number;
      let firstDayOffset = 0;

      if (group.isCalendarLayout && group.firstDayOfWeek !== undefined) {
        dotCols = 7;
        firstDayOffset = group.firstDayOfWeek;
      } else {
        dotCols = Math.ceil(Math.sqrt(dotsInGroup * (groupWidth / groupDotArea)));
      }

      const dotSize = globalDotSize;

      const gridWidth = (dotCols - 1) * (dotSize * dotSpacing) + dotSize;

      const dotStartX = groupX + (groupWidth - gridWidth) / 2;
      const dotStartY = groupY + labelHeight;

      for (let j = 0; j < dotsInGroup; j++) {
        const absoluteIndex = group.startIndex + j;

        let dotRow: number;
        let dotCol: number;

        if (group.isCalendarLayout) {
          const adjustedIndex = j + firstDayOffset;
          dotRow = Math.floor(adjustedIndex / 7);
          dotCol = adjustedIndex % 7;
        } else {
          dotRow = Math.floor(j / dotCols);
          dotCol = j % dotCols;
        }

        const x = dotStartX + dotCol * (dotSize * dotSpacing) + dotSize / 2;
        const y = dotStartY + dotRow * (dotSize * dotSpacing) + dotSize / 2;

        const isCurrent = absoluteIndex === current - 1;
        const isFilled = absoluteIndex < current;

        let fill: string;
        if (isCurrent) {
          fill = config.dotColor || '#ff6b35';
        } else if (isFilled) {
          fill = isDark ? '#ffffff' : '#1a1a1a';
        } else {
          fill = isDark ? '#3a3a3a' : '#d0d0d0';
        }

        const finalSize = dotSize * dotSizeMultiplier;
        dots += generateDotShape(x, y, finalSize, fill, config.dotShape);
      }
    }

    const lastGroup = groups[groups.length - 1];
    const lastGroupRow = Math.floor((groups.length - 1) / groupCols);
    const lastGroupY = startY + lastGroupRow * (groupHeight + groupSpacing + labelHeight);
    const lastGroupDotsCount = lastGroup.count;
    const lastGroupDotArea = groupHeight - labelHeight;

    let lastDotCols: number;
    let lastFirstDayOffset = 0;

    if (lastGroup.isCalendarLayout && lastGroup.firstDayOfWeek !== undefined) {
      lastDotCols = 7;
      lastFirstDayOffset = lastGroup.firstDayOfWeek;
    } else {
      lastDotCols = Math.ceil(Math.sqrt(lastGroupDotsCount * (groupWidth / lastGroupDotArea)));
    }

    const lastDotStartY = lastGroupY + labelHeight;

    const lastDotIndex = lastGroupDotsCount - 1;
    let lastDotRow: number;
    if (lastGroup.isCalendarLayout) {
      const adjustedIndex = lastDotIndex + lastFirstDayOffset;
      lastDotRow = Math.floor(adjustedIndex / 7);
    } else {
      lastDotRow = Math.floor(lastDotIndex / lastDotCols);
    }

    const lastDotY = lastDotStartY + lastDotRow * (globalDotSize * dotSpacing) + globalDotSize / 2;
    textBottomY = lastDotY + percentageGapFromLastDot;
  } else {
    const useCalendarLayout = config.granularity === 'day' &&
      (config.mode === 'countdown' && total <= 31);

    let cols: number;
    let rows: number;
    let firstDayOffset = 0;

    if (useCalendarLayout) {
      cols = 7;

      if (config.mode === 'countdown' && config.startDate) {
        const startDate = new Date(config.startDate);
        const dayOfWeek = startDate.getDay();
        firstDayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      }

      rows = Math.ceil((total + firstDayOffset) / 7);
    } else {
      cols = Math.ceil(Math.sqrt(total * (availableWidth / availableHeight)));
      rows = Math.ceil(total / cols);
    }

    const dotSize = Math.min(
      availableWidth / (cols * dotSpacing),
      availableHeight / (rows * dotSpacing),
      maxMonthDayDotSize
    );

    const gridWidth = (cols - 1) * (dotSize * dotSpacing) + dotSize;
    const gridHeight = (rows - 1) * (dotSize * dotSpacing) + dotSize;

    const contentTop = safeTop + textTopHeight;
    const startX = safeLeft + (availableWidth - gridWidth) / 2;
    const startY = contentTop + (availableHeight - gridHeight) / 2;

    for (let i = 0; i < total; i++) {
      let row: number;
      let col: number;

      if (useCalendarLayout) {
        const adjustedIndex = i + firstDayOffset;
        row = Math.floor(adjustedIndex / 7);
        col = adjustedIndex % 7;
      } else {
        row = Math.floor(i / cols);
        col = i % cols;
      }

      const x = startX + col * (dotSize * dotSpacing) + dotSize / 2;
      const y = startY + row * (dotSize * dotSpacing) + dotSize / 2;

      const isCurrent = i === current - 1;
      const isFilled = i < current;

      let fill: string;
      if (isCurrent) {
        fill = config.dotColor || '#ff6b35';
      } else if (isFilled) {
        fill = isDark ? '#ffffff' : '#1a1a1a';
      } else {
        fill = isDark ? '#3a3a3a' : '#d0d0d0';
      }

      const finalSize = dotSize * dotSizeMultiplier;
      dots += generateDotShape(x, y, finalSize, fill, config.dotShape);
    }

    const lastDotIndex = total - 1;
    let lastRow: number;
    if (useCalendarLayout) {
      const adjustedIndex = lastDotIndex + firstDayOffset;
      lastRow = Math.floor(adjustedIndex / 7);
    } else {
      lastRow = Math.floor(lastDotIndex / cols);
    }

    const lastDotY = startY + lastRow * (dotSize * dotSpacing) + dotSize / 2;
    textBottomY = lastDotY + percentageGapFromLastDot;
  }

  const currentDotColor = config.dotColor || '#ff6b35';

  let percentageText = '';
  const additionalDisplay = config.additionalDisplay || 'percentage';

  if (additionalDisplay === 'none') {
    if (config.customText) {
      percentageText = `
  <text x="${width / 2}" y="${textBottomY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="400" fill="${currentDotColor}" text-anchor="middle">
    ${config.customText}
  </text>`;
    }
  } else {
    const displayValue = additionalDisplay === 'percentage' ? `${percentage}%` : label;

    if (config.customText) {
      percentageText = `
  <text x="${width / 2}" y="${textBottomY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="400" text-anchor="middle">
    <tspan fill="${currentDotColor}">${config.customText}</tspan><tspan fill="${subTextColor}"> ${displayValue}</tspan>
  </text>`;
    } else {
      percentageText = `
  <text x="${width / 2}" y="${textBottomY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="400" fill="${subTextColor}" text-anchor="middle">
    ${displayValue}
  </text>`;
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  ${backgroundDef}
  <rect width="${width}" height="${height}" fill="${bgColor}"/>

  ${dots}
${percentageText}
</svg>`;
}
