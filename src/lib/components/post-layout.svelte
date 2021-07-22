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
  import Footer from "./footer.svelte";

  export let title;
  export let date;
</script>

<div class="px-1 mt-8 md:mt-16">
  <svelte:component this={H1}>
    {title}
  </svelte:component>
  <p class="md:text-xl text-gray-500">
    {new Date(date).toDateString()} by
    <strong class="text-bold">Faisal Alghurayri</strong>
  </p>
  <div class="mb-4">
    <slot />
  </div>
  <Footer />
</div>
