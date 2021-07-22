import { getPosts, getPostsRawBody } from "$lib/posts-importer";

export async function get() {
  const postsContent = await getPostsRawBody();
  const posts = await getPosts(postsContent);
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
  return {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml",
    },
    body: rss,
  };
}
