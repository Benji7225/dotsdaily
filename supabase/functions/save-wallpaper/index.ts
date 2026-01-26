import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function generateShortId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function generateUniqueId(supabase: any): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const id = generateShortId();

    const { data, error } = await supabase
      .from('wallpaper_configs')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return id;
    }

    attempts++;
  }

  throw new Error('Failed to generate unique ID after multiple attempts');
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();

    const {
      mode,
      granularity,
      grouping,
      theme,
      themeType,
      customColor,
      backgroundImage,
      dotColor,
      dotShape,
      customText,
      targetDate,
      startDate,
      birthDate,
      lifeExpectancy,
      width,
      height,
      safeTop,
      safeBottom,
      safeLeft,
      safeRight,
      timezone
    } = body;

    if (!mode || !granularity || !width || !height) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const id = await generateUniqueId(supabase);

    const { error } = await supabase
      .from('wallpaper_configs')
      .insert({
        id,
        mode,
        granularity,
        grouping: grouping || 'none',
        theme: theme || 'dark',
        theme_type: themeType || 'dark',
        custom_color: customColor || null,
        background_image: backgroundImage || null,
        dot_color: dotColor || null,
        dot_shape: dotShape || 'circle',
        custom_text: customText || null,
        target_date: targetDate || null,
        start_date: startDate || null,
        birth_date: birthDate || null,
        life_expectancy: lifeExpectancy || null,
        width,
        height,
        safe_top: safeTop,
        safe_bottom: safeBottom,
        safe_left: safeLeft,
        safe_right: safeRight,
        timezone: timezone || 'UTC'
      });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ id }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
