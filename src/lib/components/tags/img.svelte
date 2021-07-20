<script>
  import CloudinaryImg from "../cloudinary-img.svelte";

  export let src;
  export let alt;
</script>

<div>
  <CloudinaryImg {src} {alt} />
  <p class="text-center text-xs py-2">{alt}</p>
</div>
