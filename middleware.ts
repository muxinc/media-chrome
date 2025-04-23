import { next } from '@vercel/edge'

export const config = {
  matcher: '/dist/:path*.js',
};

const allowedDomains = [
  process.env.VERCEL_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  'localhost',
  '127.0.0.1'
].filter(Boolean);

const get403 = (url: URL) => 
  new Response(
    `Please use jsDelivr instead: https://cdn.jsdelivr.net/npm/media-chrome${url.pathname}`,
    {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
      }
    }
  );

export default function middleware(request: Request): Response {
  const referer = request.headers.get('referer');
  const url = new URL(request.url);

  if (!referer) {
    console.warn(`No referer header found for request to ${url}`);
    return get403(url);
  }
  
  const refererUrl = new URL(referer);
  const isAllowedDomain = allowedDomains.some(domain => 
    refererUrl.hostname === domain || refererUrl.hostname.endsWith(`.${domain}`)
  );
  
  if (!isAllowedDomain) {
    console.warn(`Blocked request from disallowed domain: ${refererUrl.hostname}. Allowed domains: ${allowedDomains.join(', ')}`);
    return get403(url);
  }
  return next();
}