import fs from "fs";
import path from "path";
import { getPosts, getPostsRawBody } from "../src/lib/posts-importer.js";

async function main() {
  console.log("running sitemap generation");
  const postsContent = await getPostsRawBody();
  const posts = await getPosts(postsContent);
  createSitemap(posts);
}

main();

function createSitemap(posts) {
  const sitemap = `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
    xmlns:xhtml="http://www.w3.org/1999/xhtml" 
    xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" 
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
    xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
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
  fs.writeFileSync(
    path.join("../.vercel_build_output/static", "sitemap.xml"),
    sitemap
  );
  console.log("sitemap generated successfully");
}
