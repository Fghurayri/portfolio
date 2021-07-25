<script>
  export let id;
  const style =
    "text-xl md:text-3xl font-bold my-8 text-gray-500 flex items-center";
</script>

{#if id}
  <a href={`#${id}`}>
    <h2 {id} class={style}>
      <span class="text-sm opacity-50">🔗 &nbsp;</span>
      <slot />
    </h2>
  </a>
{:else}
  <h2 class={style}>
    <slot />
  </h2>
{/if}
