import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface WallpaperConfig {
  mode: 'year' | 'month' | 'life' | 'countdown';
  granularity: 'day' | 'week' | 'month' | 'year';
  grouping?: 'none' | 'week' | 'month' | 'quarter' | 'year';
  targetDate?: string;
  startDate?: string;
  birthDate?: string;
  lifeExpectancy?: number;
  width?: number;
  height?: number;
  theme?: 'dark' | 'light';
  safeTop?: number;
  safeBottom?: number;
  safeLeft?: number;
  safeRight?: number;
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

function calculateGroups(config: WallpaperConfig, total: number): GroupInfo[] {
  if (!config.grouping || config.grouping === 'none' || config.mode !== 'year') {
    return [];
  }

  const groups: GroupInfo[] = [];

  if (config.granularity === 'day') {
    if (config.grouping === 'month') {
      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
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
      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
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

function calculateProgress(config: WallpaperConfig): { current: number; total: number; label: string } {
  const now = new Date();

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
      if (!config.birthDate) {
        throw new Error('birthDate required for life mode');
      }
      const birth = new Date(config.birthDate);
      const expectancy = config.lifeExpectancy || 80;

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

function generateSVG(config: WallpaperConfig): string {
  const width = config.width || 1170;
  const height = config.height || 2532;
  const isDark = config.theme !== 'light';

  const safeTop = config.safeTop || 140;
  const safeBottom = config.safeBottom || 110;
  const safeLeft = config.safeLeft || 40;
  const safeRight = config.safeRight || 40;

  const { current, total, label } = calculateProgress(config);
  const percentage = Math.round((current / total) * 100);

  const textTopHeight = 80;
  const textBottomHeight = 80;

  const availableWidth = width - safeLeft - safeRight;
  const availableHeight = height - safeTop - safeBottom - textTopHeight - textBottomHeight;

  const bgColor = isDark ? '#0a0a0a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1a1a1a';
  const subTextColor = isDark ? '#999999' : '#666666';
  const labelColor = isDark ? '#666666' : '#999999';

  const textTopY = safeTop + 40;
  const textBottomY = height - safeBottom - 40;

  const groups = calculateGroups(config, total);

  let dots = '';

  const dotSpacing = 1.6;

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

    const groupSpacing = 40;
    const labelHeight = 25;

    const groupWidth = (availableWidth - (groupCols - 1) * groupSpacing) / groupCols;
    const groupHeight = (availableHeight - (groupRows - 1) * groupSpacing - groupRows * labelHeight) / groupRows;

    const contentTop = safeTop + textTopHeight;
    const startX = safeLeft;
    const startY = contentTop;

    let globalDotSize = Infinity;

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const dotsInGroup = group.count;
      const groupDotArea = groupHeight - labelHeight;

      let dotCols: number;
      let dotRows: number;

      const isMonthWeek = config.mode === 'month' && config.granularity === 'week';

      if (isMonthWeek) {
        dotCols = dotsInGroup;
        dotRows = 1;
      } else if (group.isCalendarLayout && group.firstDayOfWeek !== undefined) {
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
      dots += `<text x="${groupX + groupWidth / 2}" y="${labelY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="500" fill="${labelColor}" text-anchor="middle">${group.label}</text>`;

      const dotsInGroup = group.count;
      const groupDotArea = groupHeight - labelHeight;

      let dotCols: number;
      let dotRows: number;
      let firstDayOffset = 0;

      const isMonthWeek = config.mode === 'month' && config.granularity === 'week';

      if (isMonthWeek) {
        dotCols = dotsInGroup;
        dotRows = 1;
      } else if (group.isCalendarLayout && group.firstDayOfWeek !== undefined) {
        dotCols = 7;
        firstDayOffset = group.firstDayOfWeek;
        dotRows = Math.ceil((dotsInGroup + firstDayOffset) / 7);
      } else {
        dotCols = Math.ceil(Math.sqrt(dotsInGroup * (groupWidth / groupDotArea)));
        dotRows = Math.ceil(dotsInGroup / dotCols);
      }

      const dotSize = globalDotSize;

      const gridWidth = dotCols * (dotSize * dotSpacing);
      const gridHeight = dotRows * (dotSize * dotSpacing);

      const dotStartX = groupX + (groupWidth - gridWidth) / 2;
      const dotStartY = groupY + labelHeight + (groupDotArea - gridHeight) / 2;

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
          fill = '#ff6b35';
        } else if (isFilled) {
          fill = isDark ? '#ffffff' : '#1a1a1a';
        } else {
          fill = isDark ? '#3a3a3a' : '#d0d0d0';
        }

        dots += `<circle cx="${x}" cy="${y}" r="${dotSize / 2}" fill="${fill}" />`;
      }
    }
  } else {
    const useCalendarLayout = config.granularity === 'day' &&
      ((config.mode === 'month') ||
       (config.mode === 'countdown' && total <= 31));

    const isMonthWeek = config.mode === 'month' && config.granularity === 'week';

    let cols: number;
    let rows: number;
    let firstDayOffset = 0;

    if (isMonthWeek) {
      cols = total;
      rows = 1;
    } else if (useCalendarLayout) {
      cols = 7;

      if (config.mode === 'month') {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const dayOfWeek = firstDay.getDay();
        firstDayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      } else if (config.mode === 'countdown' && config.startDate) {
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

    const gridWidth = cols * (dotSize * dotSpacing);
    const gridHeight = rows * (dotSize * dotSpacing);

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
        fill = '#ff6b35';
      } else if (isFilled) {
        fill = isDark ? '#ffffff' : '#1a1a1a';
      } else {
        fill = isDark ? '#3a3a3a' : '#d0d0d0';
      }

      dots += `<circle cx="${x}" cy="${y}" r="${dotSize / 2}" fill="${fill}" />`;
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>

  ${dots}

  <text x="${width / 2}" y="${textTopY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="28" font-weight="600" fill="${textColor}" text-anchor="middle">
    ${label}
  </text>

  <text x="${width / 2}" y="${textBottomY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12" font-weight="600" fill="${subTextColor}" text-anchor="middle">
    ${percentage}%
  </text>
</svg>`;
}

function generateErrorSVG(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1170" height="2532" xmlns="http://www.w3.org/2000/svg">
  <rect width="1170" height="2532" fill="#0a0a0a"/>
  <text x="585" y="1266" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="24" font-weight="600" fill="#ffffff" text-anchor="middle">
    ${message}
  </text>
</svg>`;
}

async function svgToPng(svgContent: string): Promise<Uint8Array> {
  const resvgUrl = 'https://resvg.fly.dev/convert';

  const response = await fetch(resvgUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'image/svg+xml',
    },
    body: svgContent,
  });

  if (!response.ok) {
    throw new Error(`resvg conversion failed: ${response.statusText}`);
  }

  const pngBuffer = await response.arrayBuffer();
  return new Uint8Array(pngBuffer);
}

function calculateSecondsUntilMidnight(timezone: string): number {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const parts = formatter.formatToParts(now);
    const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
    const month = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1;
    const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
    const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
    const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
    const second = parseInt(parts.find(p => p.type === 'second')?.value || '0');

    const secondsElapsedToday = hour * 3600 + minute * 60 + second;
    const secondsInDay = 86400;
    const secondsUntilMidnight = secondsInDay - secondsElapsedToday;

    return Math.max(secondsUntilMidnight, 60);
  } catch {
    return 3600;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const pathname = url.pathname;

    let config: WallpaperConfig;
    let timezone = 'UTC';

    const shortIdMatch = pathname.match(/([a-z0-9]{6,10})$/);

    if (shortIdMatch) {
      const shortId = shortIdMatch[1];

      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await supabase
        .from('wallpaper_configs')
        .select('*')
        .eq('id', shortId)
        .maybeSingle();

      if (error || !data) {
        const errorSvg = generateErrorSVG('Configuration not found');
        const errorPng = await svgToPng(errorSvg);

        return new Response(errorPng, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=60',
          },
        });
      }

      config = {
        mode: data.mode,
        granularity: data.granularity,
        grouping: data.grouping || 'none',
        targetDate: data.target_date || undefined,
        startDate: data.start_date || undefined,
        birthDate: data.birth_date || undefined,
        lifeExpectancy: data.life_expectancy || undefined,
        width: data.width,
        height: data.height,
        theme: data.theme || 'dark',
        safeTop: data.safe_top,
        safeBottom: data.safe_bottom,
        safeLeft: data.safe_left,
        safeRight: data.safe_right,
      };

      timezone = data.timezone || 'UTC';
    } else {
      config = {
        mode: (url.searchParams.get('mode') as WallpaperConfig['mode']) || 'year',
        granularity: (url.searchParams.get('granularity') as WallpaperConfig['granularity']) || 'day',
        grouping: (url.searchParams.get('grouping') as WallpaperConfig['grouping']) || 'none',
        targetDate: url.searchParams.get('target') || undefined,
        startDate: url.searchParams.get('start') || undefined,
        birthDate: url.searchParams.get('birth') || undefined,
        lifeExpectancy: url.searchParams.get('life') ? parseInt(url.searchParams.get('life')!) : undefined,
        width: url.searchParams.get('width') ? parseInt(url.searchParams.get('width')!) : 1170,
        height: url.searchParams.get('height') ? parseInt(url.searchParams.get('height')!) : 2532,
        theme: (url.searchParams.get('theme') as 'dark' | 'light') || 'dark',
        safeTop: url.searchParams.get('safeTop') ? parseInt(url.searchParams.get('safeTop')!) : 140,
        safeBottom: url.searchParams.get('safeBottom') ? parseInt(url.searchParams.get('safeBottom')!) : 110,
        safeLeft: url.searchParams.get('safeLeft') ? parseInt(url.searchParams.get('safeLeft')!) : 40,
        safeRight: url.searchParams.get('safeRight') ? parseInt(url.searchParams.get('safeRight')!) : 40,
      };
    }

    const svg = generateSVG(config);
    const png = await svgToPng(svg);

    const maxAge = calculateSecondsUntilMidnight(timezone);

    return new Response(png, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/png',
        'Cache-Control': `public, max-age=${maxAge}`,
      },
    });
  } catch (error) {
    const errorSvg = generateErrorSVG('Error generating wallpaper');

    try {
      const errorPng = await svgToPng(errorSvg);

      return new Response(errorPng, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=60',
        },
      });
    } catch {
      return new Response(errorSvg, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }
  }
});