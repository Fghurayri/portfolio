<script>
  import CloudinaryImg from "$lib/components/cloudinary-img.svelte";
  import Footer from "$lib/components/footer.svelte";
  import H1 from "$lib/components/tags/h1.svelte";
  import P from "$lib/components/tags/p.svelte";
</script>

<div class="min-h-screen flex flex-col items-center justify-center">
  <CloudinaryImg
    src="https://res.cloudinary.com/fghurayri/image/upload/v1626802989/faisal.sh/sonic.jpg"
    alt="sonic"
    extraClass="w-24 mb-8"
  />
  <H1>Hello friend! 👋</H1>
  <P>I am Faisal Alghurayri, a software developer from Saudi Arabia 🇸🇦.</P>
  <Footer />
</div>
