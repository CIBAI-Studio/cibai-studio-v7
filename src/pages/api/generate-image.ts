import type { APIRoute } from 'astro';
import { getAuthUser } from '../../lib/auth';

const FAL_KEY = import.meta.env.FAL_KEY || process.env.FAL_KEY;
const FAL_API_URL = 'https://queue.fal.run/fal-ai/flux/dev';

export const POST: APIRoute = async ({ request, cookies }) => {
  const user = getAuthUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (!FAL_KEY) {
    return new Response(JSON.stringify({ error: 'FAL_KEY not configured' }), { status: 500 });
  }

  const body = await request.json();
  const { prompt, width = 768, height = 512 } = body;

  if (!prompt || typeof prompt !== 'string') {
    return new Response(JSON.stringify({ error: 'prompt is required' }), { status: 400 });
  }

  // Style prefix for consistent look
  const styledPrompt = `${prompt}, futuristic technology, neon accents, dark background, realistic, high contrast, cinematic lighting, professional, modern`;

  try {
    // Submit to fal.ai queue
    const submitRes = await fetch(FAL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: styledPrompt,
        image_size: { width, height },
        num_images: 1,
        enable_safety_checker: true,
      }),
    });

    if (!submitRes.ok) {
      const errText = await submitRes.text();
      return new Response(JSON.stringify({ error: `fal.ai error: ${submitRes.status}`, detail: errText }), { status: 502 });
    }

    const result = await submitRes.json();

    // fal.ai flux/dev returns images directly in synchronous mode via queue endpoint
    if (result.images && result.images.length > 0) {
      return new Response(JSON.stringify({
        url: result.images[0].url,
        width: result.images[0].width,
        height: result.images[0].height,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If queued, check status
    if (result.request_id) {
      const statusUrl = `https://queue.fal.run/fal-ai/flux/dev/requests/${result.request_id}/status`;
      let attempts = 0;
      while (attempts < 30) {
        await new Promise(r => setTimeout(r, 2000));
        const statusRes = await fetch(statusUrl, {
          headers: { 'Authorization': `Key ${FAL_KEY}` },
        });
        const statusData = await statusRes.json();
        if (statusData.status === 'COMPLETED') {
          const resultUrl = `https://queue.fal.run/fal-ai/flux/dev/requests/${result.request_id}`;
          const resultRes = await fetch(resultUrl, {
            headers: { 'Authorization': `Key ${FAL_KEY}` },
          });
          const resultData = await resultRes.json();
          if (resultData.images && resultData.images.length > 0) {
            return new Response(JSON.stringify({
              url: resultData.images[0].url,
              width: resultData.images[0].width,
              height: resultData.images[0].height,
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
        }
        if (statusData.status === 'FAILED') {
          return new Response(JSON.stringify({ error: 'Image generation failed' }), { status: 502 });
        }
        attempts++;
      }
      return new Response(JSON.stringify({ error: 'Timeout waiting for image generation' }), { status: 504 });
    }

    return new Response(JSON.stringify({ error: 'Unexpected response from fal.ai', result }), { status: 502 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
