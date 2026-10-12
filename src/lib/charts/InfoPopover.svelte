<script>
  // Small circled "i" that toggles a text popover on click.
  import { InfoCircleOutline, CloseOutline } from "flowbite-svelte-icons";

  export let text = "";

  let open = false;
</script>

<div class="relative inline-flex items-center align-middle">
  <button
    type="button"
    class="text-[#8B898E] hover:text-[#3F3F46] transition-colors"
    aria-label="Més informació"
    aria-expanded={open}
    on:click={() => (open = !open)}
  >
    <InfoCircleOutline class="h-3.5 w-3.5" />
  </button>

  {#if open}
    <div
      class="absolute left-full top-0 ml-2 w-52 z-50 bg-[#F1F2F4] rounded-xl px-4 py-3 shadow-sm"
    >
      <div class="flex items-start gap-2">
        <p class="text-[#3F3F46] font-inter text-[11px] leading-snug">
          {text}
        </p>
        <button
          type="button"
          class="text-[#8B898E] hover:text-[#3F3F46] shrink-0"
          aria-label="Tancar"
          on:click={() => (open = false)}
        >
          <CloseOutline class="h-3 w-3" />
        </button>
      </div>
    </div>
  {/if}
</div>
