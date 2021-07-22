<script>
  export let href;
  export let rel;
  export let target;
</script>

<a
  {href}
  {rel}
  {target}
  class="text-blue-600 hover:underline md:text-xl focus:ring focus:ring-blue-600 outline-none"
  ><slot /></a
>
