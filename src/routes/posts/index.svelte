<script context="module">
  export const prerender = true;
  export async function load({ fetch }) {
    const response = await fetch(`/posts/get-posts`);
    if (response.ok) {
      const { posts } = await response.json();
      return {
        props: { posts },
      };
    }
    return {};
  }
</script>

<script>
  export let posts = [];
</script>

<h1>POSTS</h1>
{#each posts as post}
  <div>
    <a href={`/posts/${post.slug}`}>
      {post.title}
    </a>
  </div>
{/each}
