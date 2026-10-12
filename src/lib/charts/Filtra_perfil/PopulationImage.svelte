<script>
  // The artwork (static/animated src) and the on-screen width are resolved
  // by PopulationGrid before this component even mounts — see
  // artworkHelpers.js and imageDimensions.js. This component only paints.
  // Opacity and position are driven frame by frame by animationHelpers.js.
  export let item; // { id, sexe, edat, isActive, staticSrc, animatedSrc, width, fit }
  export let height;

  // The still SVG of the figure that was here before this one (when the
  // filters change) stays on screen, fading out, while the new figure's GIF
  // takes off; the new SVG only shows once the GIF has landed.
  let currentStaticSrc = item.staticSrc;
  let previousStaticSrc = item.staticSrc;
  let fromImg;
  let toImg;
  $: if (item.staticSrc !== currentStaticSrc) {
    previousStaticSrc = currentStaticSrc;
    currentStaticSrc = item.staticSrc;
    // Hand what is on screen over to the "previous" image right now, in the
    // same frame in which the sources change: the figure on the grid stays as
    // it was (no flash of the new figure) until its GIF has landed.
    if (fromImg && toImg) {
      fromImg.style.opacity = toImg.style.opacity;
      toImg.style.opacity = "0";
    }
  }

  function getCircleTitle(h) {
    return `${h.sexe || "Inactive"}${h.edat ? ` (${h.edat})` : ""}`;
  }
</script>

<!-- Slot of the still SVG: it is moved (while invisible) to where the figure
     arrives, never while it can be seen. -->
<div
  data-circle
  data-unit={item.id}
  data-included={item.isActive}
  class="absolute flex overflow-hidden"
  style="width: {item.width}px; height: {height}px; will-change: transform, opacity;"
  title={getCircleTitle(item)}
>
  {#if item.sexe}
    <img
      bind:this={fromImg}
      data-static-from
      src={previousStaticSrc}
      alt=""
      aria-hidden="true"
      class="figure-img"
      style="position: absolute; opacity: 0;"
    />
    <img
      bind:this={toImg}
      data-static-to
      src={item.staticSrc}
      alt="{item.sexe} {item.edat}"
      class="figure-img"
      style="position: relative; opacity: 1;"
    />
  {:else}
    <div class="w-6 h-6 rounded-full bg-gray-300" title="Not included" />
  {/if}
</div>

<!-- The only layer that travels: the same figure as the SVG, walking. It is
     decorative (the SVG carries the description) and lets clicks and hovers
     through to the slot underneath. -->
{#if item.sexe}
  <div
    data-flyer
    data-unit={item.id}
    data-fit-scale={item.fit.scale}
    data-fit-shift={item.fit.shift}
    class="pointer-events-none absolute z-10 flex overflow-hidden"
    style="width: {item.width}px; height: {height}px; opacity: 0; will-change: transform, opacity;"
    aria-hidden="true"
  >
    <img
      src={item.animatedSrc}
      alt=""
      class="figure-img"
      style="transform-origin: 50% 100%;"
    />
  </div>
{/if}
