<script>
  export let src;
  export let alt;
</script>

<div>
  <img {src} {alt} />
  <p class="text-center text-xs py-2">{alt}</p>
</div>
