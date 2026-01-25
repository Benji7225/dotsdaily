import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

interface WallpaperConfig {
  mode: string;
  granularity: string;
  grouping: string;
  theme: string;
  timezone: string;
  width: number;
  height: number;
  safe_top: number;
  safe_bottom: number;
  safe_left: number;
  safe_right: number;
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

    const now = new Date();
    const dayOfYear = getDayOfYear(now);
    const daysInYear = isLeapYear(now.getFullYear()) ? 366 : 365;
    const percentage = Math.round((dayOfYear / daysInYear) * 100);

    const isDark = config.theme !== 'light';
    const bgColor = isDark ? '#0a0a0a' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#1a1a1a';
    const labelColor = isDark ? '#666666' : '#999999';

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${config.width}" height="${config.height}" fill="${bgColor}"/>

  <!-- Textes de test TRÈS VISIBLES -->
  <text x="50" y="100" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${textColor}" text-anchor="start">JANVIER</text>
  <text x="50" y="150" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${textColor}" text-anchor="start">FÉVRIER</text>
  <text x="50" y="200" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${textColor}" text-anchor="start">MARS</text>
  <text x="50" y="250" font-family="Arial, sans-serif" font-size="18" fill="${labelColor}" text-anchor="start">Avril</text>
  <text x="50" y="300" font-family="Arial, sans-serif" font-size="18" fill="${labelColor}" text-anchor="start">Mai</text>
  <text x="50" y="350" font-family="Arial, sans-serif" font-size="18" fill="${labelColor}" text-anchor="start">Juin</text>

  <!-- Cercles -->
  <circle cx="100" cy="500" r="10" fill="${textColor}" />
  <circle cx="130" cy="500" r="10" fill="#ff6b35" />
  <circle cx="160" cy="500" r="10" fill="${isDark ? '#3a3a3a' : '#d0d0d0'}" />

  <!-- Pourcentage GROS -->
  <text x="${config.width / 2}" y="850" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#ff6b35" text-anchor="middle">${percentage}%</text>

  <!-- Debug info -->
  <text x="20" y="${config.height - 20}" font-family="Arial, sans-serif" font-size="12" fill="#ff0000" text-anchor="start">Day ${dayOfYear}/${daysInYear} - ${percentage}% - Mode: ${config.mode}</text>
</svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache');
    return res.send(svg);
  } catch (error: any) {
    return res.status(500).send(`Error: ${error.message}`);
  }
}
