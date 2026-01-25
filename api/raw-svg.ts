import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Missing wallpaper ID' });
    }

    const wallpaperModule = await import('./wallpaper.js');

    const svgReq = {
      ...req,
      query: { ...req.query, format: 'svg' }
    } as VercelRequest;

    let svgContent = '';
    let headers: Record<string, string> = {};

    const svgRes = {
      setHeader: (key: string, value: string) => {
        headers[key] = value;
        return svgRes;
      },
      status: (code: number) => {
        res.status(code);
        return svgRes;
      },
      send: (data: any) => {
        svgContent = data;
        return svgRes;
      },
      json: (data: any) => {
        svgContent = JSON.stringify(data);
        return svgRes;
      }
    } as any;

    await wallpaperModule.default(svgReq, svgRes);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache');
    return res.send(svgContent);

  } catch (error: any) {
    console.error('Raw SVG error:', error);
    return res.status(500).json({
      error: 'Failed to generate SVG',
      message: error.message
    });
  }
}
