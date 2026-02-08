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
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let userId: string | null = null;
    let userEmail: string | null = null;
    const authHeader = req.headers.get("Authorization");

    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
        const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(token);

        if (!userError && user) {
          userId = user.id;
          userEmail = user.email || null;
        }
      } catch (authError) {
        console.log('Auth check failed, continuing without user:', authError);
      }
    }

    if (userId) {
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('status, current_period_end, plan')
        .eq('user_id', userId)
        .maybeSingle();

      const hasActiveSubscription = subscription && (
        subscription.status === 'lifetime' ||
        subscription.status === 'trialing' ||
        (subscription.status === 'active' && subscription.current_period_end && new Date(subscription.current_period_end) > new Date())
      );

      if (!hasActiveSubscription) {
        return new Response(
          JSON.stringify({
            error: 'Subscription required',
            code: 'SUBSCRIPTION_REQUIRED',
            message: 'An active subscription is required to create wallpaper links'
          }),
          {
            status: 402,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }

    const body = await req.json();

    const {
      wallpaperType,
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
      additionalDisplay,
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
      timezone,
      language,
      quoteMode,
      quoteCategories,
      quoteTextColor,
      customQuotes
    } = body;

    if (!mode || !granularity || !width || !height ||
        safeTop === undefined || safeBottom === undefined ||
        safeLeft === undefined || safeRight === undefined) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
          details: { mode, granularity, width, height, safeTop, safeBottom, safeLeft, safeRight }
        }),
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

    const isStorageUrl = backgroundImage && backgroundImage.includes('/storage/v1/object/public/wallpaper-images/');

    const { error } = await supabase
      .from('wallpaper_configs')
      .insert({
        id,
        user_id: userId,
        user_email: userEmail,
        wallpaper_type: wallpaperType || 'dots',
        mode,
        granularity,
        grouping: grouping || 'none',
        theme: theme || 'dark',
        theme_type: themeType || 'dark',
        custom_color: customColor || null,
        background_image: isStorageUrl ? null : (backgroundImage || null),
        background_image_url: isStorageUrl ? backgroundImage : null,
        dot_color: dotColor || null,
        dot_shape: dotShape || 'circle',
        custom_text: customText || null,
        additional_display: additionalDisplay || 'percentage',
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
        timezone: timezone || 'UTC',
        language: language || 'en',
        quote_mode: quoteMode || 'short',
        quote_categories: quoteCategories || null,
        quote_text_color: quoteTextColor || 'white',
        custom_quotes: customQuotes || null,
        last_accessed_at: new Date().toISOString()
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
