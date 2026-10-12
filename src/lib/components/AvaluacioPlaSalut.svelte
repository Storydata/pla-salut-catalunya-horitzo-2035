<script>
  import Icon from "$lib/icons/Icon.svelte";
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

  // svg: il·lustració que va sota cada estratègia
  const items = [
    {
      key: "estrategia1",
      label: "Igualtat d'oportunitats en salut al llarg de la vida",
      icon: "users",
      svg: prepare(Pie1, "e1"),
    },
    {
      key: "estrategia2",
      label: "Entorns saludables",
      icon: "home",
      svg: prepare(Pie2, "e2"),
    },
    {
      key: "estrategia3",
      label: "Integració de l'atenció a la salut",
      icon: "stethoscope",
      svg: prepare(Pie3, "e3"),
    },
    {
      key: "estrategia4",
      label: "Palanques de canvi transversal",
      icon: "trending-up",
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
          class="mx-auto max-w-[768px] text-left text-[14px] leading-[1.6] text-[#2E3A59] md:text-base"
        >
          El Pla de Salut 2021-2025 ha establert les bases per millorar la salut
          de la població catalana. Aquesta avaluació presenta els resultats
          assolits i el grau de compliment dels objectius establerts.
        </p>
      </div>

      <div
        class="grid grid-cols-1 items-start justify-items-center gap-y-10 pt-4 md:flex md:flex-wrap md:justify-center md:gap-14"
      >
        {#each items as item (item.key)}
          <div class="flex w-full max-w-[360px] flex-col items-start md:w-[220px]">
            <!-- Icona i nom, en línia i alineats per dalt: una sola unitat
                 d'informació. L'alçada mínima (3 línies) fa que els gràfics de
                 les quatre columnes comencin a la mateixa alçada. -->
            <div class="md:min-h-[60px]">
              <div class="flex items-start gap-2">
                <Icon
                  name={item.icon}
                  class="h-[21.6px] w-[21.6px] shrink-0 text-[#2E3A59] md:h-9 md:w-9"
                />
                <h3
                  class="text-left font-['Inter',sans-serif] text-[15px] font-semibold leading-[1.3] text-[#2E3A59]"
                >
                  {item.label}
                </h3>
              </div>
            </div>
            {#if item.svg}
              <div
                class="pie mt-2 w-full md:mt-3 lg:mt-5"
                role="img"
                aria-label={item.label}
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
