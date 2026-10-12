<script>
  import IndicatorHeader from "$lib/charts/IndicatorHeader.svelte";
  import Bars_Groups from "$lib/charts/Dades_generals/Bars_Groups.svelte";
  import Territori from "$lib/charts/Dades_generals/Territori.svelte";
  import Bars_Origen from "$lib/charts/Dades_generals/Bars_Origen.svelte";
  import Bars_Regio from "./Bars_Regio.svelte";
  import { objectiuIndicadorStore } from "$lib/stores/stores";

  export let dataRaw = [];
  export let headerValue = undefined;
</script>

<div class="flex flex-col lg:flex-row gap-0">
  <div class="lg:basis-[30%]">
    <Bars_Groups {dataRaw} />
  </div>
  <div class="lg:basis-[40%]">
    <IndicatorHeader
      value={headerValue}
      indicatorName={$objectiuIndicadorStore ?? undefined}
      indicatorBelow
    />
    <Territori {dataRaw} />
    <Bars_Origen {dataRaw} />
  </div>
  <div class="lg:basis-[30%]">
    <p class="text-[#1B4853] text-xs font-bold mb-1 mt-1">Per Territori</p>
    <Bars_Regio {dataRaw} />
  </div>
</div>
