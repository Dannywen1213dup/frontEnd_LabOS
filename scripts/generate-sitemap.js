const fs = require('fs')
const path = require('path')

// 网站的基础URL
const baseUrl = 'https://ai4labos.com'

// 路由配置（从 router/index.ts 中提取）
const routes = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/submit', priority: 0.8, changefreq: 'monthly' },
  { path: '/home', priority: 0.7, changefreq: 'monthly' },
  { path: '/about', priority: 0.8, changefreq: 'monthly' }
]

// 生成当前日期（ISO格式）
const lastmod = new Date().toISOString().split('T')[0]

// 生成 sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>
`

// 写入文件
const outputPath = path.join(__dirname, '../public/sitemap.xml')
fs.writeFileSync(outputPath, sitemap, 'utf8')

console.log('✅ Sitemap generated successfully at:', outputPath)

