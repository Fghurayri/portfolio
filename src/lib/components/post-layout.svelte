<script context="module">
  import { H1, P, Code, Li, A, Img, Table, TBody, Td, Th } from "./tags/index";
  export {
    H1 as h1,
    P as p,
    Code as code,
    Li as li,
    A as a,
    Img as img,
    Table as table,
    TBody as tbody,
    Td as td,
    Th as th,
  };
</script>

<script>
  export let title;
  export let date;
  export let slug;
</script>

<div class="max-w-4xl mx-auto my-8">
  <svelte:component this={H1}>
    {title}
  </svelte:component>
  <svelte:component this={P}>
    {new Date(date).toDateString()} by
    <strong class="text-bold">Faisal Alghurayri</strong>
  </svelte:component>
  <div class="p-12 my-8">
    <slot />
  </div>
</div>
