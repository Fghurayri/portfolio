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
  import A from "$lib/components/tags/a.svelte";
  import H1 from "$lib/components/tags/h1.svelte";
  import Li from "$lib/components/tags/li.svelte";
  export let posts = [];
</script>

<div class="flex flex-col mt-8">
  <H1>Posts</H1>
  <ul>
    {#each posts as post}
      <A href={`/posts/${post.slug}`}>
        {post.title}
      </A>
    {/each}
  </ul>
</div>
