import type { APIRoute } from 'astro';
import { getAuthUser } from '../../lib/auth';
import { UPLOADS_DIR, loadSettings } from '../../lib/settings';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const POST: APIRoute = async ({ request, cookies }) => {
  const user = getAuthUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file || !(file instanceof File)) {
    return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return new Response(JSON.stringify({ error: 'File too large (max 10MB)' }), { status: 400 });
  }

  const ext = extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return new Response(JSON.stringify({ error: `Extension not allowed: ${ext}` }), { status: 400 });
  }

  // Ensure uploads directory exists
  if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  // Generate unique filename
  const timestamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
  const filename = `${timestamp}-${rand}-${safeName}`;

  // Write file to disk
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = join(UPLOADS_DIR, filename);
  writeFileSync(filePath, buffer);

  // Build the URL to return
  const settings = loadSettings();
  const domain = settings.parameters.siteDomain.replace(/\/+$/, '');
  const storagePath = settings.parameters.storageBasePath.replace(/\/+$/, '');

  let url: string;
  if (domain) {
    url = `${domain}${storagePath}/${filename}`;
  } else {
    url = `${storagePath}/${filename}`;
  }

  return new Response(JSON.stringify({ url, filename }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
