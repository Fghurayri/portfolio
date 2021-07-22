import fs from "fs";
import path from "path";
import { getPosts, getPostsRawBody } from "../src/lib/posts-importer.js";

async function main() {
  console.log("running sitemap and rss generation");
  const postsContent = await getPostsRawBody();
  const posts = await getPosts(postsContent);
  createSitemap(posts);
  createRSS(posts);
  console.log("sitemap and rss generated successfully");
}

main();

function createSitemap(posts) {
  const sitemap = `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://faisal.sh</loc>
      </url>
    ${posts
      .map(
        (post) => `
      <url>
        <loc>https://faisal.sh/posts/${post.slug}</loc>
      </url>
      `
      )
      .join("")}  
  </urlset>
  `;
  const __dirname = path.resolve();
  const location = path.join(__dirname, "static");
  fs.writeFileSync(path.join(location, "sitemap.xml"), sitemap);
}

function createRSS(posts) {
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
  <atom:link href="https://faisal.sh/rss" rel="self" type="application/rss+xml" />
  <title>Faiasl Alghurayri</title>
  <link>https://faisal.sh</link>
  <description>Portfolio web app for Faisal Alghurayri to share his experience and sample work.</description>
  ${posts
    .map(
      (post) => `<item>
  <guid>https://faisal.sh/posts/${post.slug}</guid>
  <title>${post.title}</title>
  <link>https://faisal.sh/posts/${post.slug}</link>
  <description>${post.metaDesc}</description>
  <pubDate>${new Date(post.date).toUTCString()}</pubDate>
  </item>`
    )
    .join("")}
  </channel>
  </rss>`;
  const __dirname = path.resolve();
  const location = path.join(__dirname, "static");
  fs.writeFileSync(path.join(location, "rss.xml"), rss);
}
