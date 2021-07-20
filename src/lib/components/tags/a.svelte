<script>
  export let href;
  export let rel;
  export let target;
</script>

<a {href} {rel} {target} class="text-blue-600 hover:underline"><slot /></a>
