<script>
  export let href;
  export let rel;
  export let target;
</script>

<a
  {href}
  {rel}
  {target}
  class="text-blue-600 p-2 hover:underline md:text-lg focus:ring focus:ring-blue-600 outline-none rounded-xl"
  ><slot /></a
>
