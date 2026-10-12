<script>
  import { base } from "$app/paths";
  import illustration01 from "$lib/assets/pla-salut-ilustracions-colors-nous-01.jpg";
  import illustration02 from "$lib/assets/pla-salut-ilustracions-colors-nous-02.jpg";
  import illustration03 from "$lib/assets/pla-salut-ilustracions-colors-nous-03.jpg";
  import illustration04 from "$lib/assets/pla-salut-ilustracions-colors-nous-04.jpg";

  const menuItems = [
    {
      title: "El Pla de salut de Catalunya. Horitzó 2035",
      href: `${base}/pla-salut-catalunya-horitzo-2035/`,
      image: illustration04,
      alt: "Il·lustració del Pla de salut de Catalunya. Horitzó 2035",
      desktopClass:
        "left-1/2 top-1/2 w-72 -translate-x-1/2 translate-y-[calc(-1_*_min(19vw,285px))]",
      featured: true,
    },
    {
      title: "La població de Catalunya i la seva salut.",
      href: `${base}/estructura-poblacio/`,
      image: illustration02,
      alt: "Il·lustració sobre la població de Catalunya i la seva salut",
      desktopClass: "left-0 bottom-1/2 w-72 translate-y-[min(20vw,300px)]",
    },
    {
      title: "Viure més i millor, què passaria si...",
      href: `${base}/viure-mes-i-millor/`,
      image: illustration01,
      alt: "Il·lustració sobre viure més i millor",
      desktopClass:
        "left-1/2 bottom-1/2 w-72 -translate-x-1/2 translate-y-[min(20vw,300px)]",
    },
    {
      title: "Avaluació del Pla de salut 2021-2025.",
      href: `${base}/avaluacio-pla-salut/`,
      image: illustration03,
      alt: "Il·lustració sobre l'avaluació del Pla de salut 2021-2025",
      desktopClass: "right-0 bottom-1/2 w-72 translate-y-[min(20vw,300px)]",
    },
  ];
</script>

<div class="w-full">
  <div class="mx-auto max-w-5xl">
    <div class="relative hidden min-h-screen lg:block">
      <p
        class="pointer-events-none absolute left-1/2 top-1/2 z-20 m-0 -translate-x-1/2 translate-y-[calc(-1_*_min(20vw,300px)_-_2rem)] whitespace-nowrap font-['Inter',sans-serif] text-[14px] uppercase tracking-[0.5px] text-[#2E3A59]"
      >
        Què trobaràs en aquest lloc
      </p>

      <div
        class="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[40vw] w-[40vw] max-h-[600px] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[50px] border-[#CAE0E2] opacity-20"
      />

      <p
        class="pointer-events-none absolute left-1/2 top-1/2 z-20 m-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-normal uppercase tracking-[0.5px] text-[#828898]"
      >
        Clica a una secció
      </p>

      {#each menuItems as item}
        <a
          href={item.href}
          class={`group absolute z-10 block transition-transform duration-300 ease-out will-change-transform hover:scale-[1.04] ${item.desktopClass}`}
        >
          <div class="relative z-10 px-2 text-left">
            <p
              class={item.featured
                ? "max-w-[200px] text-xl text-[#1B4853] font-bold leading-tight transition-colors duration-300 group-hover:text-[#0F3138]"
                : "max-w-[200px] text-lg text-[#1B4853] font-semibold leading-tight transition-colors duration-300 group-hover:text-[#0F3138]"}
            >
              {item.title}
            </p>
          </div>

          <img
            src={item.image}
            alt={item.alt}
            class={item.featured ? "-mt-12" : "-mt-6"}
          />
        </a>
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
              class="relative z-10 max-w-[260px] text-lg font-semibold leading-tight text-[#1B4853]"
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
