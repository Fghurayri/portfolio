<script context="module">
  export const prerender = true;

  function getBaseURL(page) {
    const { host, path } = page;
    const protocol = host.startsWith("localhost") ? "http" : "https";
    return `${protocol}://${host}${path}`;
  }

  export async function load({ fetch, page }) {
    const baseURL = getBaseURL(page);
    const response = await fetch(`${baseURL}/get-posts`);
    if (response.ok) {
      const { posts } = await response.json();
      return {
        props: { posts, baseURL },
      };
    }
    return {};
  }
</script>

<script>
  export let posts = [];
  export let baseURL;
</script>

<h1>POSTS</h1>
{#each posts as post}
  <div>
    <a href={`${baseURL}/${post.slug}`}>
      {post.title}
    </a>
  </div>
{/each}
