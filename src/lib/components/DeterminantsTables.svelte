<script>
  import { onMount } from "svelte";

  // Indicadors d'entorn: un gràfic de Datawrapper per àmbit (cada gràfic reuneix
  // tots els indicadors de l'àmbit). Cada gràfic porta a sobre l'etiqueta
  // "ÀMBIT" i, a sota, el nom de l'àmbit -- mateix estil que "INTERVENCIÓ" i el
  // nom de la intervenció del panell d'Eixos. Aquest és l'únic lloc on viuen els
  // enllaços i els noms.
  //
  // Per actualitzar un gràfic: enganxa l'URL nova de Datawrapper (el número
  // final canvia cada vegada que el tornes a publicar).
  // Per afegir un àmbit: un objecte més, a la posició on s'ha de veure.
  // L'ordre segueix la numeració dels indicadors del Pla: Pobresa 1-3,
  // Habitatge 4-6, Educació 7, Treball 8-12, Medi ambient 13-15.
  const areas = [
    {
      id: "pobresa",
      title: "Pobresa",
      src: "https://datawrapper.dwcdn.net/GiO1r/5/",
    },
    {
      id: "habitatge",
      title: "Habitatge",
      src: "https://datawrapper.dwcdn.net/DDKJA/1/",
    },
    {
      id: "educacio",
      title: "Educació",
      src: "https://datawrapper.dwcdn.net/fAPne/2/",
    },
    {
      id: "treball",
      title: "Treball",
      src: "https://datawrapper.dwcdn.net/sbk9U/1/",
    },
    {
      id: "medi-ambient",
      title: "Medi ambient",
      src: "https://datawrapper.dwcdn.net/SWl0m/3/",
    },
  ];

  let root;

  // Cada gràfic de Datawrapper avisa de la seva alçada real per postMessage
  // un cop carregat; l'alçada inicial (style) és només un valor provisional.
  // El listener es treu en desmuntar el component: una vista que es va
  // obrint i tancant no n'acumula.
  onMount(() => {
    function resize(event) {
      const heights = event.data?.["datawrapper-height"];
      if (!heights) return;
      const iframe = [...root.querySelectorAll("iframe")].find(
        (candidate) => candidate.contentWindow === event.source,
      );
      if (iframe) iframe.style.height = `${Object.values(heights)[0]}px`;
    }
    window.addEventListener("message", resize);
    return () => window.removeEventListener("message", resize);
  });
</script>

<div bind:this={root} class="tables">
  {#each areas as area (area.id)}
    <section class="area" aria-labelledby="area-{area.id}">
      <div class="flex flex-col gap-2">
        <p
          class="font-['Inter',sans-serif] text-sm uppercase tracking-wide text-[#8B898E]"
        >
          Àmbit
        </p>
        <h3
          id="area-{area.id}"
          class="font-['Inter',sans-serif] text-[20px] font-bold leading-[1.2] text-[#2E3A59] md:text-[24px]"
        >
          {area.title}
        </h3>
      </div>
      <iframe
        title={area.title}
        src={area.src}
        scrolling="no"
        loading="lazy"
        style="width: 0; min-width: 100%; height: 300px; border: none;"
      ></iframe>
    </section>
  {/each}
</div>

<style>
  /* Espaiat -- s'ajusta aquí, en un sol lloc:
     - entre el final d'un gràfic (amb la seva línia d'atribució de Datawrapper,
       que no es pot treure) i el títol de l'àmbit següent
     - entre el títol d'un àmbit i el seu gràfic (admet valors negatius, p. ex.
       -8px, si el gràfic ja porta aire per dalt dins de l'iframe) */
  .tables {
    --gap-between-areas: 50px;
    --gap-title-chart: 8px;
    display: flex;
    flex-direction: column;
    gap: var(--gap-between-areas);
  }
  .area {
    display: flex;
    flex-direction: column;
    gap: var(--gap-title-chart);
  }
</style>
