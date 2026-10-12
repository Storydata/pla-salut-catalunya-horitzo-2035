<script>
  export let colors = [];
</script>

<div class="flex flex-row items-center gap-1">
  {#each colors as color}
    <div class="w-[0.6em] h-[0.4em]" style="background-color: {color}" />
  {/each}
</div>
