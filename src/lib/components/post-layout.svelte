<script context="module">
  import {
    H1,
    H2,
    H3,
    H4,
    P,
    Code,
    Ul,
    Li,
    A,
    Img,
    Table,
    TBody,
    Td,
    Th,
    Blockquote,
  } from "./tags/index";
  export {
    H1 as h1,
    H2 as h2,
    H3 as h3,
    H4 as h4,
    P as p,
    Code as code,
    Ul as ul,
    Li as li,
    A as a,
    Img as img,
    Table as table,
    TBody as tbody,
    Td as td,
    Th as th,
    Blockquote as blockquote,
  };
</script>

<script>
  import { formatDate } from "$lib/date-format";
  import Footer from "./footer.svelte";

  export let title;
  export let date;
  export let metaDesc;
  export let slug;
  export let cover;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={`${metaDesc}`} />
  <link href={`https://faisal.sh/posts/${slug}`} rel="canonical" />

  <meta property="og:title" content={title} /><meta
    property="og:type"
    content="article"
  /><meta property="og:image" content={cover} /><meta
    property="og:url"
    content={`https://faisal.sh/posts/${slug}`}
  />
  <meta property="og:site_name" content="Faisal Alghurayri" /><meta
    property="og:locale"
    content="en_us"
  /><!-- Twitter Card data -->
  <meta name="twitter:card" content="summary_large_image" /><meta
    name="twitter:site"
    content="@fghurayri"
  /><meta name="twitter:title" content={title} /><meta
    name="twitter:description"
    content={metaDesc}
  /><meta name="twitter:image" content={cover} />
</svelte:head>
<div class="px-1 mt-8 md:mt-16">
  <svelte:component this={H1}>
    {title}
  </svelte:component>
  <p class="md:text-xl text-gray-500">
    {formatDate(date)} by
    <strong class="text-bold">Faisal Alghurayri</strong>
  </p>
  <div class="mb-4">
    <slot />
    <P>Take it easy,</P>
    <P>~Faisal</P>
  </div>
  <Footer />
</div>
