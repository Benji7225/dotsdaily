import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

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

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function calculateProgress(config: WallpaperConfig, now: Date): { current: number; total: number; label: string } {
  if (config.mode === 'year' && config.granularity === 'day') {
    const dayOfYear = getDayOfYear(now);
    const daysInYear = isLeapYear(now.getFullYear()) ? 366 : 365;
    return {
      current: dayOfYear,
      total: daysInYear,
      label: `Jour ${dayOfYear} / ${daysInYear}`
    };
  }
  throw new Error('Invalid mode/granularity combination');
}

function generateSVGDebug(config: WallpaperConfig, now: Date): string {
  const { width, height } = { width: config.width, height: config.height };
  const isDark = config.theme !== 'light';

  const { current, total } = calculateProgress(config, now);
  const percentage = Math.round((current / total) * 100);

  const bgColor = isDark ? '#0a0a0a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1a1a1a';
  const subTextColor = isDark ? '#999999' : '#666666';
  const labelColor = isDark ? '#666666' : '#999999';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>

  <!-- Test texts -->
  <text x="50" y="100" font-family="Roboto, sans-serif" font-size="18" font-weight="700" fill="${textColor}" text-anchor="start">JANVIER</text>
  <text x="50" y="150" font-family="Roboto, sans-serif" font-size="18" font-weight="700" fill="${textColor}" text-anchor="start">FÉVRIER</text>
  <text x="50" y="200" font-family="Roboto, sans-serif" font-size="14" font-weight="500" fill="${labelColor}" text-anchor="start">Mars</text>
  <text x="50" y="250" font-family="Roboto, sans-serif" font-size="14" font-weight="500" fill="${labelColor}" text-anchor="start">Avril</text>

  <!-- Test circles -->
  <circle cx="100" cy="400" r="8" fill="${textColor}" />
  <circle cx="130" cy="400" r="8" fill="#ff6b35" />
  <circle cx="160" cy="400" r="8" fill="${isDark ? '#3a3a3a' : '#d0d0d0'}" />

  <!-- Percentage -->
  <text x="${width / 2}" y="850" font-family="Roboto, sans-serif" font-size="24" font-weight="400" fill="${subTextColor}" text-anchor="middle">${percentage}%</text>

  <!-- Debug info -->
  <text x="20" y="920" font-family="Roboto, sans-serif" font-size="10" fill="#ff0000" text-anchor="start">Debug: ${current}/${total} = ${percentage}%</text>
</svg>`;
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
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).send('Invalid wallpaper ID');
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).send('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: config, error } = await supabase
      .from('wallpaper_configs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !config) {
      return res.status(404).send('Configuration not found');
    }

    const timezone = config.timezone || 'UTC';
    const now = getDateInTimezone(timezone);

    const svgContent = generateSVGDebug(config, now);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache');
    return res.send(svgContent);
  } catch (error: any) {
    return res.status(500).send(`Error: ${error.message}`);
  }
}
