<script>
  import InfoPopover from "./InfoPopover.svelte";

  export let showTotal = true;
  export let showTotalCategoria = false;
  // When set, an info icon appears after the legend; clicking it toggles this text.
  export let infoText = "";
</script>

<!-- This row shows the little color legend for the chart. -->
<div
  class="flex flex-row items-center md:items-center gap-3 px-0 py-1 justify-center"
>
  <!-- Woman -->
  <div class="flex items-center gap-1.5">
    <span class="bg-[#754480] w-[10px] h-[10px] rounded-full"></span>
    <span class="text-[#3F3F46] font-inter text-[11px]">Dones</span>
  </div>

  <!-- Men -->
  <div class="flex items-center gap-1.5">
    <span class="bg-[#26AAAA] w-[10px] h-[10px] rounded-full"></span>
    <span class="text-[#3F3F46] font-inter text-[11px]">Homes</span>
  </div>

  <!-- Total -->
  {#if showTotal === true}
    <div class="flex items-center gap-1.5">
      <span class="bg-[#EA4D50] w-[10px] h-[10px] rounded-full"></span>
      <span class="text-[#3F3F46] font-inter text-[11px]">Total</span>
    </div>
  {/if}

  <!-- Total per category (only on pages that show both totals) -->
  {#if showTotalCategoria === true}
    <div class="flex items-center gap-1.5">
      <span class="bg-[#F89D64] w-[10px] h-[10px] rounded-full"></span>
      <span class="text-[#3F3F46] font-inter text-[11px]">Total/categoria</span>
    </div>
  {/if}

  <!-- Info icon with click-to-open popover -->
  {#if infoText}
    <InfoPopover text={infoText} />
  {/if}
</div>
