<script>
  import MapDones from "./MapDones.svelte";
  import MapHomes from "./MapHomes.svelte";
  import Legend from "$lib/charts/Dades_generals/LegendMap.svelte";
  import { DONES_PALETTE, HOMES_PALETTE } from "./colorPalettes.js";

  export let dataRaw = [];
</script>

<div class="flex flex-col w-full">
  <div
    class="flex flex-row flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2"
  >
    <h3 class="text-[#1B4853] text-sm font-bold">Per sexe i territori</h3>
    <div class="flex flex-row items-center">
      <span class="text-[#3F3F46] text-[10px] mr-1.5">Menys del 15&nbsp;%</span>
      <div class="flex flex-col gap-[0.12em]">
        <Legend colors={DONES_PALETTE.colors} />
        <Legend colors={HOMES_PALETTE.colors} />
      </div>
      <span class="text-[#3F3F46] text-[10px] ml-1.5">Més del 90&nbsp;%</span>
    </div>
    <div class="flex flex-row items-center">
      <div
        class="w-[0.7em] h-[0.7em] rounded-full mr-1.5"
        style="background-color: #E8EDF2; border: 1px solid #A8B6C4"
      />
      <span class="text-[#3F3F46] text-[10px]">Sense dades</span>
    </div>
  </div>
  <p class="text-[#8B898E] text-[10px] tracking-wide text-center mt-1">
    CLICA ALS MAPES PER VEURE LES DADES
  </p>

  <!-- Al mobil els dos mapes en paral·lel queden a uns 160px d'ample cadascun
       i les comarques no es distingeixen: van un sota l'altre. -->
  <div class="flex flex-col overflow-hidden sm:flex-row">
    <div class="h-full sm:flex-1 sm:min-w-0">
      <MapDones {dataRaw} colorPalette={DONES_PALETTE} class="flex-1" />
      <h3 class="text-[#616161] text-xs text-center">Dones</h3>
    </div>
    <div class="h-full sm:flex-1 sm:min-w-0">
      <MapHomes {dataRaw} colorPalette={HOMES_PALETTE} class="flex-1" />
      <h3 class="text-[#616161] text-xs text-center">Homes</h3>
    </div>
  </div>
</div>
