<script>
  import { createEventDispatcher } from "svelte";
  import { filterSelectClasses } from "../chartHelpers";

  export let filters = {
    regio: "Tots",
    edat: "Tots",
    sexe: "Tots",
    estudis: "Tots",
    classe: "Tots",
  };

  export let edats = [];
  export let sexes = [];
  export let estudis = [];
  export let classes = [];

  const dispatch = createEventDispatcher();

  function handleChange(key, value) {
    filters[key] = value;
    dispatch("change", { [key]: value });
  }

  $: dimensions = [
    { key: "sexe", label: "Sexe", options: sexes },
    { key: "edat", label: "Edat", options: edats },
    { key: "classe", label: "Classe", options: classes },
    { key: "estudis", label: "Estudis", options: estudis },
  ];
</script>

<!-- Filters container -->
<div class="flex flex-wrap gap-3 items-center justify-center px-4 py-1 mb-6">
  {#each dimensions as dim (dim.key)}
    <select
      id={`filter-${dim.key}`}
      aria-label={dim.label}
      bind:value={filters[dim.key]}
      on:change={(e) => handleChange(dim.key, e.target.value)}
      class={`flex-1 sm:flex-none min-w-[140px] ${
        filters[dim.key] !== "Tots"
          ? filterSelectClasses.active
          : filterSelectClasses.inactive
      }`}
    >
      {#each dim.options as option}
        <option value={option}>
          {option === "Tots" ? `${dim.label}: Tots` : option}
        </option>
      {/each}
    </select>
  {/each}
</div>
