<script>
  import EstructuraPoblacioIntro from "$lib/components/EstructuraPoblacioIntro.svelte";
  import EstructuraPopulacioA from "$lib/components/EstructuraPopulacioA.svelte";
  import EstructuraPopulacioB from "$lib/components/EstructuraPopulacioB.svelte";
  import EstructuraPopulacioC from "$lib/components/EstructuraPopulacioC.svelte";
  import EstructuraPopulacioD from "$lib/components/EstructuraPopulacioD.svelte";
</script>

<svelte:head>
  <title>Estructura de la població | Pla de salut de Catalunya. Horitzó 2035</title>
</svelte:head>

<section>
  <div class="container mx-auto">
    <EstructuraPoblacioIntro />
  </div>
</section>
<section class="lg:flex lg:min-h-screen lg:items-center lg:justify-center">
  <div class="w-full">
    <EstructuraPopulacioA />
  </div>
</section>
<section class="lg:flex lg:min-h-screen lg:items-center lg:justify-center">
  <div class="w-full">
    <EstructuraPopulacioB />
  </div>
</section>
<section class="lg:flex lg:min-h-screen lg:items-center lg:justify-center">
  <div class="w-full">
    <EstructuraPopulacioC />
  </div>
</section>
<section class="lg:flex lg:min-h-screen lg:items-center lg:justify-center">
  <div class="w-full">
    <EstructuraPopulacioD />
  </div>
</section>
