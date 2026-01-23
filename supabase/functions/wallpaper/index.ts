import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(p => p);

  if (pathParts.length < 2 || pathParts[0] !== 'w') {
    return new Response(
      JSON.stringify({ error: 'Invalid URL format. Use /w/{id}' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const id = pathParts[1];
  const vercelUrl = `https://dotsdaily.app/w/${id}`;

  return Response.redirect(vercelUrl, 301);
});
