<script>
  import CloudinaryImg from "$lib/components/cloudinary-img.svelte";
  import Footer from "$lib/components/footer.svelte";
  import H1 from "$lib/components/tags/h1.svelte";
</script>

<svelte:head>
  <title>Faisal Alghurayri</title>
  <meta
    name="description"
    content="Portfolio web app for Faisal Alghurayri to share his experience and sample work."
  />
  <link href="https://faisal.sh" rel="canonical" />
</svelte:head>
<div class="min-h-screen flex flex-col items-center justify-center">
  <CloudinaryImg
    src="https://res.cloudinary.com/fghurayri/image/upload/v1626802989/faisal.sh/sonic.jpg"
    alt="sonic"
    extraClasses="w-24 mb-8 !shadow-none"
  />
  <H1>Hello friend! 👋</H1>
  <Footer />
</div>
