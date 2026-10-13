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
        class="px-5 pb-3 text-center font-['Inter',sans-serif] text-lg font-semibold leading-[1.4] text-[#2E3A59] lg:pt-[var(--section-top-gap)]"
      >
        On es concentra l'envelliment
      </p>
      <div
        class="flex w-full max-w-[1200px] flex-col items-center gap-10 px-5 md:flex-row md:items-start md:justify-center md:gap-8 lg:max-w-none lg:gap-[6%] lg:px-0"
      >
        <div
          class="flex w-full max-w-[500px] flex-col items-center gap-4 lg:w-[37%] lg:max-w-none"
        >
          <div class="min-h-[50px] lg:[&>div]:mt-2">
            <Counter
              startValue={0}
              endValue={109.5}
              decimals={1}
              color="#2E3A59"
              label="majors de 65 anys per cada 100 hab. de 15 anys"
            />
          </div>

          <div data-chart-box class="w-full overflow-hidden">
            <iframe
              title="Evolució de l'índex d'envelliment a Catalunya"
              aria-label="Line chart"
              id="datawrapper-chart-Rli1a"
              src="https://datawrapper.dwcdn.net/Rli1a/6/"
              scrolling="no"
              frameborder="0"
              class="w-full border-0"
              style="min-width: 100%;"
              height="580"
              data-external="1"
            />
          </div>
        </div>

        <div
          class="flex w-full max-w-[500px] flex-col items-center gap-4 lg:w-[37%] lg:max-w-none"
        >
          <div class="min-h-[50px] lg:[&>div]:mt-2">
            <Counter
              startValue={0}
              endValue={148.4}
              decimals={1}
              color="#2E3A59"
              label="majors de 65 anys per cada 100 hab. de 15 anys"
            />
          </div>

          <div data-chart-box class="w-full overflow-hidden">
            <iframe
              title="Índex d'envelliment per comarques"
              aria-label="Map"
              id="datawrapper-chart-Ze6Gj"
              src="https://datawrapper.dwcdn.net/Ze6Gj/1/"
              scrolling="no"
              frameborder="0"
              class="w-full border-0"
              style="min-width: 100%;"
              height="580"
              data-external="1"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      bind:this={textBlock}
      class="hidden lg:absolute lg:z-10 lg:flex lg:max-w-xl lg:flex-col"
    >
      <div class="bg-white/90 rounded-2xl text-left p-8 shadow-xl">
        <Icon
          name="elderly_woman"
          class="bg-gray-100 p-3 w-14 h-14 rounded-full text-[#2E3A59]"
        />
        <h2 class="text-[#2E3A59] pt-2 font-bold mb-3">Context</h2>
        <p class="text-[#2E3A59] leading-relaxed">
          Catalunya té una estructura de població per edats força envellida, que
          s'explica, entre d'altres, per una esperança de vida cada cop més
          llarga i una fecunditat més baixa. Aquesta tendència ha anat en
          augment en els darrers anys i avui dia en més de la mitjana de
          comarques del territori català hi ha una proporció més elevada de
          majors de 65 anys vivint-hi respecte als altres grups d'edat.
        </p>
      </div>
    </div>
  </div>
</div>
