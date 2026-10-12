<script>
  import { base } from "$app/paths";
  import Icon from "$lib/icons/Icon.svelte";
  import { fade } from "svelte/transition";

  const items = [
    {
      key: "fumar",
      label: "... deixes de fumar",
      icon: "cigarette-off",
      gifs: { dona: "dona-A.gif", home: "home-A.gif" },
      years: { dona: "+9", home: "+12" },
      tops: { dona: "21%", home: "12%" },
      color: "#FE3A49",
      tint: "26",
    },
    {
      key: "alimentacio",
      label: "... fas una alimentació saludable",
      icon: "apple",
      gifs: { dona: "dona-B.gif", home: "home-B.gif" },
      years: { dona: "+4", home: "+5" },
      tops: { dona: "50%", home: "45%" },
      color: "#FF8F68",
      tint: "26",
    },
    {
      key: "alcohol",
      label: "... deixes el consum d'alcohol",
      icon: "beer-off",
      gifs: { dona: "dona-C.gif", home: "home-C.gif" },
      years: { dona: "+2", home: "+3" },
      tops: { dona: "67%", home: "62%" },
      color: "#D0C4FF",
      tint: "40",
    },
    {
      key: "activitat",
      label: "... tens una activitat física saludable",
      icon: "bike",
      gifs: { dona: "dona-D.gif", home: "home-D.gif" },
      years: { dona: "+8", home: "+7" },
      tops: { dona: "37%", home: "31%" },
      color: "#2B3A5C",
      tint: "26",
    },
  ];

  let activeKey = null;
  let playCount = 0;
  let showYears = false;
  let yearsTimer;

  const GIF_DURATION = 2400;

  function selectItem(key) {
    activeKey = key;
    playCount += 1;
    showYears = false;
    clearTimeout(yearsTimer);
    yearsTimer = setTimeout(() => (showYears = true), GIF_DURATION);
  }
  $: activeItem = items.find((i) => i.key === activeKey) ?? null;
</script>

<div class="relative w-full lg:min-h-[180vh]">
  <div
    class="lg:sticky lg:top-[var(--site-header-h)] lg:z-10 lg:h-[calc(100vh-var(--site-header-h))]"
  >
    <div class="pb-4 pt-[var(--section-top-gap)] text-center">
      <p class="section-title">Què passaria si...</p>
    </div>
    <div class="container mx-auto px-4">
      <div class="mb-6 text-center">
        <p
          class="text-[11px] font-normal uppercase tracking-[0.5px] text-[#828898]"
        >
          Clica a les icones per saber quants anys guanyem<br />
          per seguir uns hàbits saludables
        </p>
      </div>

      <div
        class="grid grid-cols-2 items-start justify-items-center gap-x-3 gap-y-6 md:flex md:flex-wrap md:justify-center md:gap-12 lg:gap-20"
      >
        {#each items as item (item.key)}
          <button
            on:click={() => selectItem(item.key)}
            class="group flex w-full cursor-pointer flex-col items-center transition-transform hover:scale-105 md:w-[160px]"
          >
            <div class="animate-pulse-slow relative mb-2 md:mb-4">
              <div
                class="flex h-14 w-14 items-center justify-center rounded-full transition-colors md:h-[clamp(3rem,8vh,6rem)] md:w-[clamp(3rem,8vh,6rem)]"
                style="background-color: {item.color + item.tint}"
              >
                <Icon
                  name={item.icon}
                  class="h-6 w-6 md:h-[clamp(1.25rem,3.4vh,2.5rem)] md:w-[clamp(1.25rem,3.4vh,2.5rem)]"
                  color={item.color}
                />
              </div>
            </div>
            <h3
              class="text-center font-['Inter',sans-serif] text-[11px] leading-[1.25] text-[#2E3A59] md:text-[clamp(12px,1.6vh,15px)] md:leading-[1.3]"
            >
              {item.label}
            </h3>
          </button>
        {/each}
      </div>

      {#if activeItem}
        <div
          class="mx-auto mb-12 mt-12 w-full max-w-[1200px] text-center md:mb-16"
          transition:fade={{ duration: 200 }}
        >
          <!-- Placeholder: contingut pendent de definir per a "{activeItem.label}" -->
        </div>
      {/if}
    </div>

    {#if activeItem?.gifs}
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 hidden items-end justify-center gap-24 pb-0.5 lg:flex lg:gap-40"
        transition:fade={{ duration: 200 }}
      >
        <div class="relative">
          {#if showYears && activeItem.years}
            <div
              class="absolute right-full -mr-[42%] w-max text-center"
              style="top: {activeItem.tops.dona}"
              transition:fade={{ duration: 300 }}
            >
              <p
                class="border-b pb-1 leading-none"
                style="border-color: {activeItem.color}; color: {activeItem.color}"
              >
                <span class="text-2xl font-medium">{activeItem.years.dona}</span
                >
                <span class="text-sm">anys</span>
              </p>
              <p class="mt-1 text-sm" style="color: {activeItem.color}">
                de vida
              </p>
            </div>
          {/if}
          <img
            src="{base}/gifs-animados/{activeItem.gifs.dona}?v={playCount}"
            alt="Dona"
            class="h-[clamp(12rem,42vh,30rem)] w-auto"
          />
        </div>
        <div class="relative">
          {#if showYears && activeItem.years}
            <div
              class="absolute left-full -ml-[42%] w-max text-center"
              style="top: {activeItem.tops.home}"
              transition:fade={{ duration: 300 }}
            >
              <p
                class="border-b pb-1 leading-none"
                style="border-color: {activeItem.color}; color: {activeItem.color}"
              >
                <span class="text-2xl font-medium">{activeItem.years.home}</span
                >
                <span class="text-sm">anys</span>
              </p>
              <p class="mt-1 text-sm" style="color: {activeItem.color}">
                de vida
              </p>
            </div>
          {/if}
          <img
            src="{base}/gifs-animados/{activeItem.gifs.home}?v={playCount}"
            alt="Home"
            class="h-[clamp(12rem,42vh,30rem)] w-auto"
          />
        </div>
      </div>
    {/if}

    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 hidden items-end justify-center gap-10 pb-0.5 lg:flex"
    >
      <img
        src="{base}/gifs-animados/Dona-espera.gif"
        alt="Dona esperant"
        class="h-[clamp(5rem,12vh,8rem)] w-auto"
      />
      <span class="pb-1 text-[15px] uppercase tracking-[0.5px] text-[#2E3A59]">
        Dona
      </span>
      <div class="w-72 md:w-80"></div>
      <span class="pb-1 text-[15px] uppercase tracking-[0.5px] text-[#2E3A59]">
        Home
      </span>
      <img
        src="{base}/gifs-animados/Home-espera.gif"
        alt="Home esperant"
        class="h-[clamp(5rem,12vh,8rem)] w-auto"
      />
    </div>

    <!-- Mobil i tauleta: la composicio d'escriptori situa les figures al peu
         de la seccio fixada i penja les anotacions als costats amb
         `right-full` / `left-full`, cosa que en una pantalla estreta les deixa
         fora de pantalla. Aqui van sempre l'una al costat de l'altra, en flux
         normal, amb l'anotacio a sota de cada figura; l'alcada escala amb el
         viewport i `max-w-full` limita la figura tambe per amplada perque les
         dues hi capiguen en un mobil estret. -->
    <div
      class="mt-10 flex flex-row items-end justify-center gap-4 pb-12 sm:gap-8 lg:hidden"
    >
      {#each ["dona", "home"] as sexe (sexe)}
        <div class="flex w-1/2 max-w-[260px] flex-col items-center">
          <span
            class="mb-2 text-[13px] uppercase tracking-[0.5px] text-[#2E3A59]"
          >
            {sexe === "dona" ? "Dona" : "Home"}
          </span>

          {#if activeItem?.gifs}
            <img
              src="{base}/gifs-animados/{activeItem.gifs[sexe]}?v={playCount}"
              alt={sexe === "dona" ? "Dona" : "Home"}
              class="h-[clamp(9rem,26vh,20rem)] w-auto max-w-full object-contain"
            />
          {:else}
            <img
              src="{base}/gifs-animados/{sexe === 'dona'
                ? 'Dona-espera'
                : 'Home-espera'}.gif"
              alt={sexe === "dona" ? "Dona esperant" : "Home esperant"}
              class="h-[clamp(6rem,16vh,10rem)] w-auto max-w-full object-contain"
            />
          {/if}

          {#if activeItem && showYears}
            <div class="mt-3 text-center" transition:fade={{ duration: 300 }}>
              <p
                class="border-b pb-1 leading-none"
                style="border-color: {activeItem.color}; color: {activeItem.color}"
              >
                <span class="text-2xl font-medium">
                  {activeItem.years[sexe]}
                </span>
                <span class="text-sm">anys</span>
              </p>
              <p class="mt-1 text-sm" style="color: {activeItem.color}">
                de vida
              </p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>
