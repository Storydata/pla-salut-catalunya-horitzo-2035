<script>
  import { onMount } from "svelte";
  import Counter from "$lib/components/counter.svelte";

  let root;

  // Aquesta seccio va en flux normal (no fixada ni amb parallax): cada grafic
  // de Datawrapper pren l'alcada que ell mateix reporta, sense retallar-lo.
  onMount(() => {
    const handleDatawrapperResize = (e) => {
      const heights = e.data && e.data["datawrapper-height"];
      if (!heights || !root) return;
      root.querySelectorAll("iframe").forEach((iframe) => {
        if (iframe.contentWindow !== e.source) return;
        for (const key in heights) iframe.style.height = heights[key] + "px";
      });
    };

    window.addEventListener("message", handleDatawrapperResize);
    return () => window.removeEventListener("message", handleDatawrapperResize);
  });
</script>

<div
  bind:this={root}
  class="flex w-full flex-col items-center pb-6 pt-12 lg:pb-8 lg:pt-0"
>
  <p
    class="px-5 pb-3 text-center font-['Inter',sans-serif] text-lg font-bold leading-[1.4] text-[#2E3A59] lg:pt-[var(--section-top-gap)]"
  >
    Índex socioeconòmic i nivell d’estudis
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
          endValue={36.5}
          decimals={1}
          suffix="&nbsp;%"
          color="#2E3A59"
          label="dels catalans tenen formació superior"
        />
      </div>

      <div class="w-full">
        <iframe
          title="Nivell de formació de la població"
          aria-label="Gràfic de línies"
          id="datawrapper-chart-uN1CF"
          src="https://datawrapper.dwcdn.net/uN1CF/1/"
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
          endValue={83.7}
          decimals={1}
          color="#2E3A59"
          label="Alt Empordà té l’Índex més baix"
          suffix="&nbsp;%"
        />
      </div>

      <div class="w-full">
        <iframe
          title="Formació superior per comarques"
          aria-label="Mapa"
          id="datawrapper-chart-FSoVB"
          src="https://datawrapper.dwcdn.net/FSoVB/1/"
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
