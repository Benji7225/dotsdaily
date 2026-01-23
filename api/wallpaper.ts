import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

interface WallpaperConfig {
  mode: string;
  granularity: string;
  grouping: string;
  theme: string;
  theme_type: string;
  custom_color: string | null;
  background_image: string | null;
  dot_color: string | null;
  target_date: string | null;
  start_date: string | null;
  birth_date: string | null;
  life_expectancy: number | null;
  width: number;
  height: number;
  safe_top: number;
  safe_bottom: number;
  safe_left: number;
  safe_right: number;
  timezone: string;
}

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

interface GroupInfo {
  startIndex: number;
  endIndex: number;
  label: string;
  count: number;
  firstDayOfWeek?: number;
  isCalendarLayout?: boolean;
}

interface DotStyle {
  spacing: number;
  size: number;
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

function calculateGroups(config: WallpaperConfig, total: number): GroupInfo[] {
  if (!config.grouping || config.grouping === 'none' || config.mode !== 'year') {
    return [];
  }

  const groups: GroupInfo[] = [];

  if (config.granularity === 'day') {
    if (config.grouping === 'month') {
      const monthNames = ['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin', 'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
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
      const quarters = ['T1', 'T2', 'T3', 'T4'];
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
      const monthNames = ['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin', 'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
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
      const quarters = ['T1', 'T2', 'T3', 'T4'];
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

function calculateProgress(config: WallpaperConfig, now: Date): { current: number; total: number; label: string } {
  switch (config.mode) {
    case 'year': {
      if (config.granularity === 'day') {
        const dayOfYear = getDayOfYear(now);
        const daysInYear = isLeapYear(now.getFullYear()) ? 366 : 365;
        return {
          current: dayOfYear,
          total: daysInYear,
          label: `Jour ${dayOfYear} / ${daysInYear}`
        };
      } else if (config.granularity === 'week') {
        const weekOfYear = getWeekOfYear(now);
        const weeksInYear = 52;
        return {
          current: weekOfYear,
          total: weeksInYear,
          label: `Semaine ${weekOfYear} / ${weeksInYear}`
        };
      }
      break;
    }

    case 'month': {
      if (config.granularity === 'day') {
        const dayOfMonth = now.getDate();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        return {
          current: dayOfMonth,
          total: daysInMonth,
          label: `Jour ${dayOfMonth} / ${daysInMonth}`
        };
      } else if (config.granularity === 'week') {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentWeek = Math.ceil((now.getDate() + firstDay.getDay()) / 7);
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const totalWeeks = Math.ceil((daysInMonth + firstDay.getDay()) / 7);
        return {
          current: currentWeek,
          total: totalWeeks,
          label: `Semaine ${currentWeek} / ${totalWeeks}`
        };
      }
      break;
    }

    case 'life': {
      if (!config.birth_date) {
        throw new Error('birthDate required for life mode');
      }
      const birth = new Date(config.birth_date);
      const expectancy = config.life_expectancy || 80;

      if (config.granularity === 'year') {
        const ageInYears = now.getFullYear() - birth.getFullYear();
        return {
          current: Math.min(ageInYears, expectancy),
          total: expectancy,
          label: `${ageInYears} ans / ${expectancy} ans`
        };
      } else if (config.granularity === 'month') {
        const ageInMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
        const totalMonths = expectancy * 12;
        return {
          current: Math.min(ageInMonths, totalMonths),
          total: totalMonths,
          label: `${ageInMonths} mois / ${totalMonths} mois`
        };
      } else if (config.granularity === 'week') {
        const ageInWeeks = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 7));
        const totalWeeks = expectancy * 52;
        return {
          current: Math.min(ageInWeeks, totalWeeks),
          total: totalWeeks,
          label: `${ageInWeeks} semaines / ${totalWeeks} semaines`
        };
      }
      break;
    }

    case 'countdown': {
      if (!config.target_date) {
        throw new Error('targetDate required for countdown mode');
      }
      const target = new Date(config.target_date);
      const start = config.start_date ? new Date(config.start_date) : new Date();

      if (config.granularity === 'day') {
        const totalDays = Math.ceil((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const daysElapsed = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))) + 1;
        const daysLeft = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        return {
          current: Math.min(daysElapsed, totalDays),
          total: totalDays,
          label: `${daysLeft}j restants`
        };
      } else if (config.granularity === 'week') {
        const totalWeeks = Math.ceil((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7));
        const weeksElapsed = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7))) + 1;
        const weeksLeft = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7)));
        return {
          current: Math.min(weeksElapsed, totalWeeks),
          total: totalWeeks,
          label: `${weeksLeft}s restantes`
        };
      } else if (config.granularity === 'month') {
        const totalMonths = Math.ceil((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
        const monthsElapsed = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))) + 1;
        const monthsLeft = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
        return {
          current: Math.min(monthsElapsed, totalMonths),
          total: totalMonths,
          label: `${monthsLeft}m restants`
        };
      } else if (config.granularity === 'year') {
        const totalYears = Math.ceil((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
        const yearsElapsed = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365))) + 1;
        const yearsLeft = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365)));
        return {
          current: Math.min(yearsElapsed, totalYears),
          total: totalYears,
          label: `${yearsLeft}a restantes`
        };
      }
      break;
    }

    default:
      throw new Error('Invalid mode');
  }

  throw new Error('Invalid granularity for mode');
}

function generateSVG(config: WallpaperConfig, modelSpecs: ModelSpecs, now: Date): string {
  const { width, height, safeArea } = modelSpecs;
  const isDark = config.theme !== 'light';

  const safeTop = safeArea.top;
  const safeBottom = safeArea.bottom;
  const safeLeft = safeArea.left;
  const safeRight = safeArea.right;

  const { current, total } = calculateProgress(config, now);
  const percentage = Math.round((current / total) * 100);

  const textTopHeight = 0;
  const textBottomHeight = 50;

  const availableWidth = width - safeLeft - safeRight;
  const availableHeight = height - safeTop - safeBottom - textTopHeight - textBottomHeight;

  let bgColor = isDark ? '#0a0a0a' : '#ffffff';
  let backgroundDef = '';

  if (config.theme_type === 'custom' && config.custom_color) {
    bgColor = config.custom_color;
  } else if (config.theme_type === 'image' && config.background_image) {
    backgroundDef = `<defs>
      <pattern id="bgImage" x="0" y="0" width="1" height="1">
        <image href="${config.background_image}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>
      </pattern>
    </defs>`;
    bgColor = 'url(#bgImage)';
  }

  const textColor = isDark ? '#ffffff' : '#1a1a1a';
  const subTextColor = isDark ? '#999999' : '#666666';
  const labelColor = isDark ? '#666666' : '#999999';

  const percentageGapFromLastDot = 60;

  const groups = calculateGroups(config, total);

  let dots = '';
  let textBottomY = height - safeBottom - 25;

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
    const labelHeight = isYearDayMonth ? 12 : 25;

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
      let dotRows: number;
      let firstDayOffset = 0;

      if (group.isCalendarLayout && group.firstDayOfWeek !== undefined) {
        dotCols = 7;
        firstDayOffset = group.firstDayOfWeek;
        dotRows = Math.ceil((dotsInGroup + firstDayOffset) / 7);
      } else {
        dotCols = Math.ceil(Math.sqrt(dotsInGroup * (groupWidth / groupDotArea)));
        dotRows = Math.ceil(dotsInGroup / dotCols);
      }

      const dotSize = globalDotSize;

      const gridWidth = (dotCols - 1) * (dotSize * dotSpacing) + dotSize;
      const gridHeight = (dotRows - 1) * (dotSize * dotSpacing) + dotSize;

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
          fill = config.dot_color || '#ff6b35';
        } else if (isFilled) {
          fill = isDark ? '#ffffff' : '#1a1a1a';
        } else {
          fill = isDark ? '#3a3a3a' : '#d0d0d0';
        }

        const radius = (dotSize / 2) * dotSizeMultiplier;
        dots += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" />`;
      }
    }

    const lastGroup = groups[groups.length - 1];
    const lastGroupRow = Math.floor((groups.length - 1) / groupCols);
    const lastGroupY = startY + lastGroupRow * (groupHeight + groupSpacing + labelHeight);
    const lastGroupDotsCount = lastGroup.count;
    const lastGroupDotArea = groupHeight - labelHeight;

    let lastDotCols: number;
    let lastDotRows: number;
    let lastFirstDayOffset = 0;

    if (lastGroup.isCalendarLayout && lastGroup.firstDayOfWeek !== undefined) {
      lastDotCols = 7;
      lastFirstDayOffset = lastGroup.firstDayOfWeek;
      lastDotRows = Math.ceil((lastGroupDotsCount + lastFirstDayOffset) / 7);
    } else {
      lastDotCols = Math.ceil(Math.sqrt(lastGroupDotsCount * (groupWidth / lastGroupDotArea)));
      lastDotRows = Math.ceil(lastGroupDotsCount / lastDotCols);
    }

    const lastGridHeight = (lastDotRows - 1) * (globalDotSize * dotSpacing) + globalDotSize;
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

      if (config.mode === 'countdown' && config.start_date) {
        const startDate = new Date(config.start_date);
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
        fill = config.dot_color || '#ff6b35';
      } else if (isFilled) {
        fill = isDark ? '#ffffff' : '#1a1a1a';
      } else {
        fill = isDark ? '#3a3a3a' : '#d0d0d0';
      }

      const radius = (dotSize / 2) * dotSizeMultiplier;
      dots += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" />`;
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

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  ${backgroundDef}
  <rect width="${width}" height="${height}" fill="${bgColor}"/>

  ${dots}

  <text x="${width / 2}" y="${textBottomY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="400" fill="${subTextColor}" text-anchor="middle">
    ${percentage}%
  </text>
</svg>`;
}

async function convertSVGToPNG(svgContent: string): Promise<Buffer> {
  return await sharp(Buffer.from(svgContent))
    .png()
    .toBuffer();
}

function getDateInTimezone(timezone: string): Date {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(new Date());
    const year = parts.find(p => p.type === 'year')!.value;
    const month = parts.find(p => p.type === 'month')!.value;
    const day = parts.find(p => p.type === 'day')!.value;
    return new Date(`${year}-${month}-${day}`);
  } catch {
    return new Date();
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Client-Info, Apikey');
    return res.status(200).end();
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid wallpaper ID', received: id });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error: 'Supabase configuration missing',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: config, error } = await supabase
      .from('wallpaper_configs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(404).json({
        error: 'Configuration not found',
        details: error.message,
        id: id
      });
    }

    if (!config) {
      return res.status(404).json({
        error: 'Configuration not found',
        id: id,
        details: 'No config data returned'
      });
    }

    const timezone = config.timezone || 'UTC';
    const now = getDateInTimezone(timezone);
    const dateKey = now.toISOString().split('T')[0];

    const { data: cachedPng } = await supabase
      .from('wallpaper_cache')
      .select('*')
      .eq('id', `${id}-${dateKey}`)
      .gte('expires_at', new Date().toISOString())
      .maybeSingle();

    if (cachedPng && cachedPng.png_data) {
      const pngBlob = Buffer.from(cachedPng.png_data);
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.send(pngBlob);
    }

    const modelSpecs: ModelSpecs = {
      width: config.width,
      height: config.height,
      safeArea: {
        top: config.safe_top,
        bottom: config.safe_bottom,
        left: config.safe_left,
        right: config.safe_right,
      },
    };

    const svgContent = generateSVG(config, modelSpecs, now);
    const pngBuffer = await convertSVGToPNG(svgContent);

    const nextMidnight = new Date(now);
    nextMidnight.setDate(nextMidnight.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);

    await supabase
      .from('wallpaper_cache')
      .upsert({
        id: `${id}-${dateKey}`,
        png_data: pngBuffer,
        expires_at: nextMidnight.toISOString(),
      });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.send(pngBuffer);
  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
