<script>
  export let id;
  const style =
    "text-3xl md:text-5xl font-bold my-8 text-gray-500 flex items-center";
</script>

{#if id}
  <a href={`#${id}`}>
    <h1 {id} class={style}>
      <span class="text-base opacity-50">🔗 &nbsp;</span>
      <slot />
    </h1>
  </a>
{:else}
  <h1 class={style}>
    <slot />
  </h1>
{/if}
