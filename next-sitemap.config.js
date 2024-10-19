/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.cambioml.com',
  generateRobotsTxt: true,
  exclude: [
    '/api/*',
    '/blog/starter',
    '/homepage-old',
    '/account-preprod',
    '/playground-3a284dca-393d-4d28-8a7a-bf202d475442',
    '/playground-preprod-68084e44-5354-4f62-848c-7fd7bd4eb976',
    '/pricing-5c81bd65-c90b-4399-b58d-8447e28f3ceb',
    '/pricing-0938e435-3582-4ea5-8cf6-efac773e92d0',
    '/pricing-data-e4db6104-a3a4-4aff-8019-febee0b4acf4',
    '/pricing-extractor-mapping-2-2e5958fb-349d-4edd-85c5-07428721ee2e',
    '/pricing-extractor-mapping-3-6ff54494-5c86-42d2-bdd9-33b7b425fe71',
    '/pricing-extractor-mapping-d8015005-9f60-4cba-891d-344943e4c5e',
    '/pricing-sec-api-d8015005-9f60-4cba-891d-344943e4c5e8',
    '/pricing-sec-api-v2-a32a0418-4a3b-4bae-98dc-490225aa3701',
    '/pricing-stripe-test-b8809880-03ce-421b-a599-1da1b94a82d5',
    '/products-fdce3eb9-aa2b-4abf-8842-4bde6dc987c4',
  ],
  sitemapSize: 5000,
};
