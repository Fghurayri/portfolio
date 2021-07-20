<script>
  export let href;
  export let rel;
</script>

<a
  {href}
  {rel}
  class="underline bg-gray-600 font-medium text-white hover:bg-gray-800 pt-0.5 pb-1 px-2 rounded-xl"
  ><slot /></a
>
