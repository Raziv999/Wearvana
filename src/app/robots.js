export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*'],
      },
      {
        // Block AI scrapers from training on your product data
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'CCBot'],
        disallow: '/',
      },
    ],
    sitemap: 'https://wearvana.com/sitemap.xml',
    host: 'https://wearvana.com',
  }
}
