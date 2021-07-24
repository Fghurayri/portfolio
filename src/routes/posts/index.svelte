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
  import { formatDate } from "$lib/date-format";
  export let posts = [];
</script>

<svelte:head>
  <title>Posts</title>
  <meta
    name="description"
    content="Technical posts on JavaScript, React, Svelte, Elixir, and other wonderful tools, written by Faisal Alghurayri"
  />
  <link href="https://faisal.sh/posts" rel="canonical" />
</svelte:head>

<div class="flex flex-col mt-8">
  <H1>Posts</H1>
  <ul>
    {#each posts as post}
      <div class="mb-4">
        <p class="p-2 text-gray-500">
          [{formatDate(post.date)}]
          <A href={`/posts/${post.slug}`}>
            {post.title}
          </A>
          <span class="text-xs text-gray-400">
            ~ {post.readingTime}m reading</span
          >
        </p>
      </div>
    {/each}
  </ul>
</div>
