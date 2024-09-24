/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.cambioml.com',
  generateRobotsTxt: true,
  exclude: ['/api/*'],
  sitemapSize: 5000,
};
