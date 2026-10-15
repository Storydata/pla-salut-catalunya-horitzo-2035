<script>
  import { animate, scroll } from "motion";
  import { onMount } from "svelte";
  import Counter from "$lib/components/counter.svelte";
  import { createStickyChartHeight } from "$lib/utils/stickyChartHeight.js";
  import Icon from "$lib/icons/Icon.svelte";

  let container;
  let stage;
  let stack;
  let textBlock;

  onMount(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");

    // Els grafics es queden a l'alcada que els dona Datawrapper. Si amb el
    // titol i els comptadors no caben a la caixa fixada, aquest bloc puja amb el
    // scroll el que li sobra: el parallax continua i no es retalla res.
    const stopChartHeight = createStickyChartHeight({ container, stage, stack });

    // El bloc de context nomes flota (i per tant nomes s'anima amb el scroll)
    // quan la seccio esta fixada, es a dir a partir de lg. Per sota queda en
    // flux normal sota els grafics i no se li ha de tocar el transform.
    let stopScroll;

    const syncScrollAnimation = () => {
      stopScroll?.();
      stopScroll = undefined;

      if (!desktop.matches) {
        textBlock.style.transform = "";
        textBlock.style.opacity = "";
        return;
      }

      stopScroll = scroll(
        animate(
          textBlock,
          {
            opacity: [1, 1, 1],
            transform: [
              "translateY(100vh)",
              "translateY(0px)",
              "translateY(-100vh)",
            ],
          },
          {
            easing: "easeInOut",
            offset: [0, 0.1, 1],
          },
        ),
        {
          target: container,
          offset: ["start start", "end start"],
        },
      );
    };

    syncScrollAnimation();
    desktop.addEventListener("change", syncScrollAnimation);

    return () => {
      stopScroll?.();
      desktop.removeEventListener("change", syncScrollAnimation);
      stopChartHeight();
    };
  });
</script>

<div bind:this={container} class="relative lg:h-[400vh]">
  <div
    bind:this={stage}
    class="w-full flex flex-col items-center py-12 lg:sticky lg:top-[var(--site-header-h)] lg:h-[calc(100vh-var(--site-header-h))] lg:overflow-hidden lg:py-0"
  >
    <div bind:this={stack} class="flex w-full flex-col items-center">
      <p
        class="px-5 pb-3 text-center font-['Inter',sans-serif] text-lg font-bold leading-[1.4] text-[#2E3A59] lg:pt-[var(--section-top-gap)]"
      >
        Com creix la població
      </p>
      <div
        class="mx-auto flex w-full max-w-[900px] flex-col items-center gap-4 px-5 lg:w-[80%] lg:max-w-none lg:px-0"
      >
        <div class="flex flex-col items-center gap-2 md:flex-row md:gap-40">
          <div class="min-h-[50px] lg:[&>div]:mt-2">
            <Counter
              startValue={0}
              endValue={-13722}
              color="#d23a12"
              label="creixement natural al 2023"
            />
          </div>

          <div class="min-h-[50px] lg:[&>div]:mt-2">
            <Counter
              startValue={0}
              endValue={122593}
              color="#cb8959"
              label="creixement migratori al 2023"
            />
          </div>
        </div>

        <div data-chart-box class="w-full overflow-hidden">
          <iframe
            title="Creixement natural i migratori de la població a Catalunya"
            aria-label="Line chart"
            id="datawrapper-chart-O1GNI"
            src="https://datawrapper.dwcdn.net/O1GNI/3/"
            scrolling="no"
            frameborder="0"
            class="w-full border-0"
            style="min-width: 100%;"
            data-external="1"
          />
        </div>
      </div>
    </div>

    <div
      bind:this={textBlock}
      class="hidden lg:absolute lg:z-10 lg:flex lg:max-w-xl lg:flex-col"
    >
      <div class="bg-white/90 rounded-2xl text-left p-8 shadow-xl">
        <Icon
          name="trending-up"
          class="bg-gray-100 p-3 w-14 h-14 rounded-full text-[#2E3A59]"
        />
        <h2 class="text-[#2E3A59] pt-2 font-bold mb-3">Context</h2>
        <p class="text-[#2E3A59] leading-relaxed">
          La població de Catalunya ha crescut considerablement els darrers 4
          anys. Les projeccions poblacionals de l'Idescat ja mostraven aquesta
          tendència creixent i aquest augment es confirma ara amb les dades
          actuals. El creixement de la població de Catalunya ha estat d’un 1,3% interanual. Aquest increment s'explica, entre
          d'altres, pel flux migratori donat que el creixement natural és
          negatiu.
        </p>
      </div>
    </div>
  </div>
</div>
