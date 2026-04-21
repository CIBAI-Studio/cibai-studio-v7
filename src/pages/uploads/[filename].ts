import type { APIRoute } from 'astro';
import { UPLOADS_DIR } from '../../lib/settings';
import { existsSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
};

export const GET: APIRoute = async ({ params }) => {
  const { filename } = params;
  if (!filename || filename.includes('..') || filename.includes('/')) {
    return new Response('Not found', { status: 404 });
  }

  const filePath = join(UPLOADS_DIR, filename);
  if (!existsSync(filePath)) {
    return new Response('Not found', { status: 404 });
  }

  const ext = extname(filename).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const data = readFileSync(filePath);

  return new Response(data, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
