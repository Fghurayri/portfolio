import { getPosts, getPostsRawBody } from "$lib/posts-importer";

export async function get() {
  const postsContent = await getPostsRawBody();
  return {
    body: JSON.stringify({ posts: await getPosts(postsContent) }),
  };
}
