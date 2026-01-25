import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { getRobotoRegular } = await import('./fonts-base64.js');
    const font = getRobotoRegular();

    return res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      buildDate: '2026-01-25T13:25:00Z',
      version: '2.0.0',
      fontSource: 'fonts-base64.ts (embedded)',
      fontLoaded: true,
      fontSize: font.length,
      expectedFontSize: 305608,
      fontSizeMatch: font.length === 305608,
      features: {
        base64Fonts: true,
        debugLogging: true,
        textSupport: true
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      error: error.message,
      stack: error.stack,
      buildDate: '2026-01-25T13:25:00Z',
      version: '2.0.0',
      fontSource: 'fonts-base64.ts (FAILED TO LOAD)'
    });
  }
}
