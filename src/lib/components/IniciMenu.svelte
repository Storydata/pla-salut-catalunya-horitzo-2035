<script>
  import { base } from "$app/paths";
  import illustration01 from "$lib/assets/pla-salut-ilustracions-colors-nous-01.jpg";
  import illustration02 from "$lib/assets/pla-salut-ilustracions-colors-nous-02.jpg";
  import illustration03 from "$lib/assets/pla-salut-ilustracions-colors-nous-03.jpg";
  import illustration04 from "$lib/assets/pla-salut-ilustracions-colors-nous-04.jpg";
  import illustrationOrientacio from "$lib/assets/PLA-SALUT-orientacio.svg";

  // Els salts de línia (\n) dels títols es respecten (`whitespace-pre-line`) i
  // fan que no calgui limitar l'ample de la caixa de text.
  const orientacio = {
    title: "Orientació del Pla de Salut",
    href: `${base}/orientacio/`,
    image: illustrationOrientacio,
    alt: "Il·lustració sobre l'orientació del Pla de salut",
    desktopClass: "relative flex w-[25vw] flex-col justify-between",
  };
  const pla = {
    title: "El Pla de salut de Catalunya.\nHoritzó 2035",
    href: `${base}/pla-salut-catalunya-horitzo-2035/`,
    image: illustration04,
    alt: "Il·lustració del Pla de salut de Catalunya. Horitzó 2035",
    desktopClass: "relative flex w-max flex-col justify-between",
    featured: true,
  };
  const poblacio = {
    title: "La població de Catalunya\ni la seva salut.",
    href: `${base}/estructura-poblacio/`,
    image: illustration02,
    alt: "Il·lustració sobre la població de Catalunya i la seva salut",
    desktopClass: "absolute block left-0 bottom-1/2 w-72 translate-y-[min(20vw,300px)]",
  };
  const viure = {
    title: "Viure més i millor, què passaria si...",
    href: `${base}/viure-mes-i-millor/`,
    image: illustration01,
    alt: "Il·lustració sobre viure més i millor",
    desktopClass:
      "absolute block left-1/2 bottom-1/2 w-72 -translate-x-1/2 translate-y-[min(20vw,300px)]",
  };
  const avaluacio = {
    title: "Avaluació del Pla de salut 2021-2025.",
    href: `${base}/avaluacio-pla-salut/`,
    image: illustration03,
    alt: "Il·lustració sobre l'avaluació del Pla de salut 2021-2025",
    desktopClass: "absolute block right-0 bottom-1/2 w-72 translate-y-[min(20vw,300px)]",
  };

  // A escriptori, "Orientació" i "El Pla de salut..." formen una fila (`w-max`:
  // l'ample del bloc és el que ocupen les dues targetes) centrada a la web.
  // Les dues targetes s'estiren a la mateixa alçada i la il·lustració va a baix
  // de tot: els títols queden alineats per dalt i les imatges per baix. Les
  // altres tres es col·loquen cadascuna pel seu compte (`contents`: sense caixa
  // pròpia).
  const desktopRows = [
    {
      class:
        "absolute left-1/2 top-1/2 z-10 flex w-max -translate-x-1/2 translate-y-[calc(-1_*_min(19vw,285px))]",
      items: [orientacio, pla],
    },
    { class: "contents", items: [poblacio, viure, avaluacio] },
  ];
  // Mòbil i tauleta: una sola llista, "Orientació" la primera.
  const menuItems = desktopRows.flatMap((row) => row.items);
</script>

<div class="w-full">
  <div class="mx-auto max-w-5xl">
    <!-- De lg a 1224px el conjunt es redueix un 15% (al voltant del cercle
         central) perquè les targetes no s'arrepleguin; des de 1225px, a mida
         completa. -->
    <div
      class="relative hidden min-h-screen lg:block lg:scale-[0.85] min-[1225px]:scale-100"
    >
      <p
        class="pointer-events-none absolute left-1/2 top-1/2 z-20 m-0 -translate-x-1/2 translate-y-[calc(-1_*_min(20vw,300px)_-_2rem)] whitespace-nowrap font-['Inter',sans-serif] text-[14px] uppercase tracking-[0.5px] text-[#2E3A59]"
      >
        Què trobaràs en aquest lloc
      </p>

      <div
        class="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[445px] w-[445px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[50px] border-[#CAE0E2] opacity-20"
      />

      <p
        class="pointer-events-none absolute left-1/2 top-1/2 z-20 m-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-normal uppercase tracking-[0.5px] text-[#828898]"
      >
        Clica a una secció
      </p>

      {#each desktopRows as row}
        <div class={row.class}>
          {#each row.items as item}
            <a
              href={item.href}
              class={`group z-10 transition-transform duration-300 ease-out will-change-transform hover:scale-[1.04] ${item.desktopClass}`}
            >
              <div class="relative z-10 px-2 text-left">
                <p
                  class={`whitespace-pre-line leading-tight text-[#1B4853] transition-colors duration-300 group-hover:text-[#0F3138] ${
                    item.title.includes("\n") ? "" : "max-w-[200px]"
                  } ${item.featured ? "text-xl font-bold" : "text-lg font-semibold"}`}
                >
                  {item.title}
                </p>
              </div>

              <img
                src={item.image}
                alt={item.alt}
                class={`w-[245px] ${item.featured ? "-mt-12" : "-mt-6"}`}
              />
            </a>
          {/each}
        </div>
      {/each}
    </div>

    <div class="px-6 py-12 sm:px-8 lg:hidden">
      <p
        class="m-0 text-center font-['Inter',sans-serif] text-[14px] uppercase tracking-[0.5px] text-[#2E3A59]"
      >
        Què trobaràs en aquest lloc
      </p>

      <p
        class="mt-3 text-center text-[11px] font-normal uppercase tracking-[0.5px] text-[#828898]"
      >
        Clica a una secció
      </p>

      <div class="mt-10 flex flex-col gap-8">
        {#each menuItems as item}
          <a
            href={item.href}
            class="block transition-transform duration-300 ease-out active:scale-[0.98]"
          >
            <p
              class="relative z-10 max-w-[260px] whitespace-pre-line text-lg font-semibold leading-tight text-[#1B4853]"
            >
              {item.title}
            </p>

            <img src={item.image} alt={item.alt} class="-mt-4 w-full" />
          </a>
        {/each}
      </div>
    </div>
  </div>
</div>
