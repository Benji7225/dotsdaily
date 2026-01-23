import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let robotoRegularBuffer: Buffer | null = null;
let robotoMediumBuffer: Buffer | null = null;

export function getRobotoRegular(): Buffer {
  if (!robotoRegularBuffer) {
    try {
      robotoRegularBuffer = readFileSync(join(__dirname, 'Roboto-Regular.ttf'));
    } catch (error) {
      console.error('Failed to load Roboto-Regular.ttf:', error);
      throw error;
    }
  }
  return robotoRegularBuffer;
}

export function getRobotoMedium(): Buffer {
  if (!robotoMediumBuffer) {
    try {
      robotoMediumBuffer = readFileSync(join(__dirname, 'Roboto-Medium.ttf'));
    } catch (error) {
      console.error('Failed to load Roboto-Medium.ttf:', error);
      throw error;
    }
  }
  return robotoMediumBuffer;
}
