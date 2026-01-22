import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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

    const shortIdMatch = pathname.match(/\/w\/([a-z0-9]{6,10})$/);

    if (shortIdMatch) {
      const shortId = shortIdMatch[1];
      const storageUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/wallpapers/${shortId}.png`;

      return Response.redirect(storageUrl, 302);
    }

    return new Response('Invalid URL', {
      status: 400,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error', {
      status: 500,
      headers: corsHeaders,
    });
  }
});
