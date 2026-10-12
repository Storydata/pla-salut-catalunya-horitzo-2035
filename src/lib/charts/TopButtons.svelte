<script>
  import { createEventDispatcher } from "svelte";
  import { Button, ButtonGroup } from "flowbite-svelte";
  import {
    ChevronDownOutline,
    ChevronRightOutline,
  } from "flowbite-svelte-icons";

  const dispatch = createEventDispatcher();
  const keyLabel = [
    { key: "perfil", label: "Filtra per veure un perfil" },
    { key: "general", label: "Per territori i eixos de desigualtat" },
    { key: "comparar", label: "Evolució general/ eixos indicadors" },
  ];

  export let options = keyLabel;
  export let activeKey = options[0].key;

  const select = (key) => {
    if (key === activeKey) return;
    activeKey = key;
    dispatch("change", { key });
  };
</script>

<ButtonGroup
  class="flex flex-col gap-3 sm:flex-row flex-wrap mb-3 shadow-none"
  aria-label="Selecció de secció"
>
  {#each options as option}
    {@const isActive = option.key === activeKey}
    <Button
      color={isActive ? "dark" : "light"}
      on:click={() => select(option.key)}
      aria-pressed={isActive}
      class={`w-full flex-1 justify-between gap-4 text-sm border-none p-2 pl-5 focus:outline-none focus:ring-0 ${
        isActive
          ? "bg-[#2E3A59] text-white hover:!bg-[#2E3A59]"
          : "bg-[#F1F3F6] text-[#828898] hover:!bg-[#F1F3F6]"
      }`}
    >
      <span class="font-inter text-sm font-medium"> {option.label}</span>
      <svelte:component
        this={isActive ? ChevronDownOutline : ChevronRightOutline}
        class="h-6 w-6 stroke-[1] text-inherit"
        aria-hidden="true"
      />
    </Button>
  {/each}
</ButtonGroup>
