<script>
  import ExplorarIndicadors from "$lib/components/ExplorarIndicadors.svelte";
</script>

<svelte:head>
  <title>Objectius, metes i indicadors | Pla de salut de Catalunya. Horitzó 2035</title>
</svelte:head>

<!-- L'id l'usa IndicadorViewer.svelte per realinear el scroll en canviar de pantalla -->
<section id="pla_salut_catalunya_horitzo_2035" class="flex flex-col lg:min-h-screen">
  <div class="container mx-auto">
    <ExplorarIndicadors />
  </div>
</section>
