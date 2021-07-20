<script context="module">
  import { H1, P, Code, Li, A } from "./tags/index";
  export { H1 as h1, P as p, Code as code, Li as li, A as a };
</script>

<script>
  export let title;
  export let date;
</script>

<div class="max-w-6xl mx-auto my-8">
  <svelte:component this={H1}>
    {title}
  </svelte:component>
  <svelte:component this={P}>
    {new Date(date).toDateString()} by
    <strong class="text-bold">Faisal Alghurayri</strong>
  </svelte:component>
  <div
    class="p-12 rounded-xl my-8"
    style="background-color: rgb(254, 245, 221);"
  >
    <slot />
  </div>
</div>
