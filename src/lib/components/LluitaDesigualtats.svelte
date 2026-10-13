<script>
  import { onMount } from "svelte";
  import Icon from "$lib/icons/Icon.svelte";
  // En línia (?raw), no com a imatge: dins d'una imatge el document SVG està
  // aïllat i no pot fer servir la Inter de la pàgina.
  import SvgSexe from "$lib/assets/Desigualtats-salut-eixos-SEXE.svg?raw";
  import SvgEdat from "$lib/assets/Desigualtats-salut-eixos-EDAT.svg?raw";
  import SvgClasseSocial from "$lib/assets/Desigualtats-salut-eixos-C-SOCIAL.svg?raw";

  export let onClose = () => {};

  // Els fitxers reutilitzen els noms .cls-1… amb valors diferents i,
  // en línia, els seus estils afecten tot el document: cal prefixar-los.
  function prepare(raw, key) {
    return raw
      .replace(/<\?xml[^>]*\?>/, "")
      .replace(/cls-/g, `${key}-cls-`)
      .replace(/id="Capa_1"/, `id="Capa_1-${key}"`);
  }

  const eixos = [
    { key: "sexe", label: "Per sexe", svg: prepare(SvgSexe, "sexe") },
    { key: "edat", label: "Per edat", svg: prepare(SvgEdat, "edat") },
    {
      key: "classe",
      label: "Per classe social",
      svg: prepare(SvgClasseSocial, "classe"),
    },
    // Placeholder: reutilitzen SVGs existents fins que hi hagi els definitius
    {
      key: "estudis",
      label: "Per nivell d'estudis",
      svg: prepare(SvgClasseSocial, "estudis"),
    },
    {
      key: "nacionalitat",
      label: "Per país d'origen",
      svg: prepare(SvgEdat, "nacionalitat"),
    },
  ];

  let activeKey = "sexe";
  let svgVisible = true;

  $: activeEix = eixos.find((e) => e.key === activeKey) ?? eixos[0];

  async function selectEix(key) {
    if (key === activeKey) return;
    svgVisible = false;
    await new Promise((r) => setTimeout(r, 250));
    activeKey = key;
    svgVisible = true;
  }

  let root;

  onMount(() => {
    // En obrir la secció, situa el títol a dalt en comptes de mantenir el scroll anterior
    root?.scrollIntoView({ block: "start" });
  });
</script>

<div
  bind:this={root}
  class="relative w-full lg:min-h-[180vh]"
  style="animation: componentFadeIn 800ms ease both;"
>
  <div class="flex flex-col py-8">
    <div class="relative mb-8 px-4 pt-[var(--section-top-gap)] text-center">
      <p
        class="font-inter text-base font-normal uppercase tracking-[1px] text-[#2E3A59]"
      >
        Estat de la salut | Lluita contra les desigualtats
      </p>
      <button
        on:click={onClose}
        class="absolute right-4 top-12 cursor-pointer text-gray-500 transition-colors hover:text-gray-800 lg:top-24"
      >
        <Icon name="x" size={24} />
      </button>
    </div>

    <div class="container mx-auto px-4">
      <div class="mx-auto w-full max-w-[1100px]">
        <h2
          class="mb-6 text-center font-inter text-lg font-bold text-[#2e3a59]"
        >
          Desigualtats en salut per eixos socials (2024)
        </h2>

        <div class="mb-6 flex flex-col items-center">
          <div class="w-full">
            <div class="mb-6 flex flex-wrap justify-center gap-3">
              {#each eixos as eix}
                <button
                  on:click={() => selectEix(eix.key)}
                  class="rounded-md px-6 py-2 font-inter text-sm uppercase tracking-[0.5px] transition-colors cursor-pointer {activeKey ===
                  eix.key
                    ? 'bg-[#2E3A59] text-white'
                    : 'bg-[#E8EDF2] text-[#2E3A59] hover:bg-[#dbe3ec]'}"
                >
                  {eix.label}
                </button>
              {/each}
            </div>

            <div
              class="mx-auto grid max-w-[820px] gap-8 text-left md:grid-cols-2"
            >
              <div>
                <p
                  class="font-inter text-[11px] font-medium uppercase tracking-[0.5px] text-[#828898]"
                >
                  Mida de la bombolla
                </p>
                <p
                  class="font-inter text-[11px] uppercase leading-[1.6] tracking-[0.5px] text-[#828898]"
                >
                  Indica la diferència de prevalença entre 2 grups extrems. Les
                  diferències es mostren a partir de +5 punts.
                </p>
              </div>
              <div>
                <p
                  class="font-inter text-[11px] font-medium uppercase tracking-[0.5px] text-[#828898]"
                >
                  Color
                </p>
                <p
                  class="font-inter text-[11px] uppercase leading-[1.6] tracking-[0.5px] text-[#828898]"
                >
                  Indica quin grup suporta més càrrega
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="mb-16 flex justify-center"
          style="opacity: {svgVisible ? 1 : 0}; transition: opacity {svgVisible
            ? 600
            : 250}ms ease;"
        >
          {#key activeEix.key}
            <div
              class="eix h-auto w-full max-w-[620px]"
              role="img"
              aria-label="Desigualtats en salut per eixos socials: {activeEix.label}"
            >
              {@html activeEix.svg}
            </div>
          {/key}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Els SVG no porten width/height: escalen al contenidor i hereten la Inter. */
  .eix :global(svg) {
    display: block;
    width: 100%;
    height: auto;
    font-family: "Inter", sans-serif;
  }
</style>
