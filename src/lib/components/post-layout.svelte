<script context="module">
  import { H1, P } from "./tags/index";
  export { H1 as h1, P as p };
</script>

<script>
  export let title;
  export let date;
</script>

<svelte:component this={H1}>
  {title}
</svelte:component>
<svelte:component this={P}>
  on: {date}
</svelte:component>
<slot />
