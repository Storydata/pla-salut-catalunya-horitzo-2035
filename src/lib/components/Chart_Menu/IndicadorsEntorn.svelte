<script>
  import Icon from "$lib/icons/Icon.svelte";
  import DeterminantsTables from "$lib/components/DeterminantsTables.svelte";

  // Torna a l'inici de la secció del Pla de salut (la pantalla d'entrada amb
  // Objectius de salut, Indicadors d'entorn i Eixos estratègics).
  export let onBack = () => {};
</script>

<div class="py-4">
  <!-- Capçalera: mateixa estructura que dins d'un eix o d'un objectiu general
       (botó de tornar + icona + títol), amb la icona del botó d'entrada. -->
  <div class="mx-auto w-full max-w-2xl">
    <div class="mb-8 flex items-center gap-6">
      <button
        on:click={onBack}
        class="flex flex-shrink-0 flex-col items-start gap-1 text-left text-[#8B898E]"
      >
        <Icon name="corner-up-left" class="h-5 w-5 flex-shrink-0" />
        <span class="text-xs">TORNAR AL<br />PLA DE SALUT</span>
      </button>

      <div class="flex min-w-0 flex-1 items-center gap-4">
        <div
          class="flex h-16 w-16 flex-shrink-0 items-center justify-center bg-[#F3F4F7] md:h-24 md:w-24"
          style="border-radius: 12%;"
        >
          <Icon
            name="file-chart-column-increasing"
            class="h-7 w-7 md:h-10 md:w-10"
            color="#2B3A5C"
            strokeWidth={1.75}
          />
        </div>
        <h2
          class="min-w-0 text-lg font-bold leading-tight text-[#2E3A59] md:text-2xl"
        >
          Indicadors d'entorn
        </h2>
      </div>
    </div>
  </div>

  <div class="mx-auto mb-12 max-w-[760px] text-center">
    <p
      class="font-inter text-[14px] leading-[1.75] text-[#2e3a59] md:text-base md:leading-[1.9]"
    >
      L'OMS defineix els determinants socials de la salut com les
      circumstàncies en què les persones neixen, creixen, treballen, viuen i
      envelleixen. La nostra salut està determinada en gran mesura per aquestes
      causes fonamentals alienes a la medicina, que inclouen, entre altres, una
      educació de qualitat, l'accés a aliments nutritius i unes condicions
      d'habitatge i de treball dignes.
    </p>
  </div>

  <div class="mx-auto mb-16 w-full max-w-[900px]">
    <DeterminantsTables />
  </div>
</div>
