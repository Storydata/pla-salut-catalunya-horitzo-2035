<script>
  import { Spinner } from "flowbite-svelte";
</script>

<div
  class="fixed inset-0 flex flex-col items-center justify-center bg-white z-50"
>
  <div class="text-center">
    <Spinner class="w-12 h-12 mb-4 fill-[#26AAAA]" />
    <h2 class="text-2xl font-semibold text-[#1B4853]">S'està carregant...</h2>
    <p class="text-[#1B4853] mt-2">Espereu mentre carreguem les dades</p>
  </div>
</div>

<style>
</style>
