<script>
  export let id;
  const style =
    "text-lg md:text-xl font-bold my-8 text-gray-500 flex items-center";
</script>

{#if id}
  <a href={`#${id}`}>
    <h3 {id} class={style}>
      <span class="text-xs opacity-50">🔗 &nbsp;</span>
      <slot />
    </h3>
  </a>
{:else}
  <h3 class={style}>
    <slot />
  </h3>
{/if}
