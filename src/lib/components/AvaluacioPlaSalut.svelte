<script>
  import Estrategia1 from "$lib/assets/SALUT-avaluacio -01.png";
  import Estrategia2 from "$lib/assets/SALUT-avaluacio -02.png";
  import Estrategia3 from "$lib/assets/SALUT-avaluacio -03.png";
  import Estrategia4 from "$lib/assets/SALUT-avaluacio -04.png";
  // En línia (?raw), no com a imatge: dins d'una imatge el document SVG està
  // aïllat i no pot fer servir la Inter de la pàgina.
  import Pie1 from "$lib/assets/Pies/estrategia-1.svg?raw";
  import Pie2 from "$lib/assets/Pies/estrategia-2.svg?raw";
  import Pie3 from "$lib/assets/Pies/estrategia-3.svg?raw";
  import Pie4 from "$lib/assets/Pies/estrategia-4.svg?raw";

  // Els quatre fitxers reutilitzen els noms .cls-1… amb valors diferents i,
  // en línia, els seus estils afecten tot el document: cal prefixar-los.
  function prepare(raw, key) {
    return raw
      .replace(/<\?xml[^>]*\?>/, "")
      .replace(/cls-/g, `${key}-cls-`)
      .replace(/id="Capa_1"/, `id="Capa_1-${key}"`);
  }

  // image: il·lustració que va al costat del nom; svg: la que va sota.
  // Els noms van sempre en dues línies: el salt (\n) es respecta amb
  // `whitespace-pre-line`.
  const items = [
    {
      key: "estrategia1",
      label: "Igualtat d'oportunitats en\nsalut al llarg de la vida",
      image: Estrategia1,
      svg: prepare(Pie1, "e1"),
    },
    {
      key: "estrategia2",
      label: "Entorns\nsaludables",
      image: Estrategia2,
      svg: prepare(Pie2, "e2"),
    },
    {
      key: "estrategia3",
      label: "Integració de l'atenció\na la salut",
      image: Estrategia3,
      svg: prepare(Pie3, "e3"),
    },
    {
      key: "estrategia4",
      label: "Palanques de canvi\ntransversal",
      image: Estrategia4,
      svg: prepare(Pie4, "e4"),
    },
  ];
</script>

<div class="relative w-full lg:min-h-[120vh]">
  <div class="lg:sticky lg:top-[var(--site-header-h)] lg:z-10">
    <div class="pb-4 pt-[var(--section-top-gap)] text-center">
      <p class="section-title">Avaluació del pla de salut 2021-2025</p>
    </div>
    <div class="container mx-auto px-4">
      <div class="mb-3 text-center md:mb-4">
        <p class="section-subtitle">Grau d'assoliment</p>
      </div>

      <div class="relative mb-8 text-center md:mb-12">
        <p
          class="mx-auto max-w-[560px] text-center text-[14px] leading-[1.6] text-[#2E3A59] md:text-base"
        >
          El Pla de Salut 2021-2025 ha finalitzat, presentem els resultats
          assolits i el grau de compliment dels objectius establerts.
        </p>
      </div>

      <div
        class="grid grid-cols-1 items-start justify-items-center gap-y-10 pt-4 md:grid-cols-2 md:gap-y-14 xl:grid-cols-4"
      >
        {#each items as item (item.key)}
          <div class="flex w-full max-w-[360px] flex-col items-start md:w-[285px]">
            <!-- Imatge (55px) i nom, en línia: una sola unitat d'informació.
                 Les quatre columnes tenen l'ample necessari perquè el nom
                 càpiga en dues línies, de manera que els gràfics de sota
                 comencen a la mateixa alçada. -->
            <div class="flex items-center gap-2">
              <img
                src={item.image}
                alt=""
                class="h-[55px] w-[55px] shrink-0"
              />
              <h3
                class="whitespace-pre-line text-left font-['Inter',sans-serif] text-[15px] font-semibold leading-[1.3] text-[#2E3A59]"
              >
                {item.label}
              </h3>
            </div>
            {#if item.svg}
              <div
                class="pie mt-2 w-[80%] md:mt-3 lg:mt-5"
                role="img"
                aria-label={item.label.replace("\n", " ")}
              >
                {@html item.svg}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  /* Els SVG no porten width/height: escalen al contenidor i hereten la Inter. */
  .pie :global(svg) {
    display: block;
    width: 100%;
    height: auto;
    font-family: "Inter", sans-serif;
  }
</style>
