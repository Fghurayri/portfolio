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
  export let posts = [];
</script>

<div class="flex flex-col mt-8">
  <H1>Posts</H1>
  <ul>
    {#each posts as post}
      <div class="mb-4">
        <p class="p-2 text-gray-500">
          [{post.date}]
          <A href={`/posts/${post.slug}`}>
            {post.title}
          </A>
        </p>
      </div>
    {/each}
  </ul>
</div>
