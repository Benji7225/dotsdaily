import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  const debug = {
    hasSupabaseUrl: !!supabaseUrl,
    hasSupabaseKey: !!supabaseKey,
    supabaseUrlPrefix: supabaseUrl?.substring(0, 20) || 'MISSING',
  };

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ ...debug, error: 'Supabase config missing' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('wallpaper_configs')
      .select('id, mode, granularity')
      .eq('id', 'cb1nym21')
      .maybeSingle();

    return res.json({
      ...debug,
      success: true,
      configFound: !!data,
      config: data,
      error: error?.message,
    });
  } catch (err: any) {
    return res.status(500).json({
      ...debug,
      error: err.message,
    });
  }
}
