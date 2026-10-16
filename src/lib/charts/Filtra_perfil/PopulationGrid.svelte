<script>
  import { onMount, onDestroy } from "svelte";
  import { shuffleByEdat } from "$lib/charts/Filtra_perfil/dataHelpers.js";
  import PopulationImage from "$lib/charts/Filtra_perfil/PopulationImage.svelte";
  import { resolveArtwork } from "$lib/charts/Filtra_perfil/artworkHelpers.js";
  import { getFigureFit } from "$lib/charts/Filtra_perfil/figureFit.js";
  import {
    preloadImageDimensions,
    getImageDimensions,
  } from "$lib/charts/Filtra_perfil/imageDimensions.js";
  import {
    LAYOUT_CONSTANTS,
    getResponsiveConfig,
    layoutCenteredRows,
    getFigures,
    buildTargets,
    animateFigures,
  } from "$lib/charts/Filtra_perfil/animationHelpers.js";

  export let populationData = [];

  // ── 1. Responsive tracking ────────────────────────────────────────────
  // Everything else (figure size, spacing, how many fit per row) is derived
  // from these two numbers, so this is the only place screen size enters.
  let containerDiv;
  let containerWidth = 0;
  let windowWidth = typeof window !== "undefined" ? window.innerWidth : 1200;

  $: config = getResponsiveConfig(windowWidth);

  function measureContainerWidth() {
    if (containerDiv) containerWidth = containerDiv.offsetWidth;
  }

  onMount(() => {
    windowWidth = window.innerWidth;
    measureContainerWidth();

    // Debounced so dragging the window edge (or a mobile browser's UI bar
    // toggling during scroll) doesn't replay the whole dispersal/regroup
    // animation on every intermediate resize tick — only once things settle.
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        windowWidth = window.innerWidth;
        measureContainerWidth();
      }, 250);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  });

  // ── 2. Resolve artwork + measure real width per figure ──────────────────
  // populationData only has sexe/edat/isActive. Before laying anything out we
  // need to know, for every unit, which SVG/GIF it will show and how wide
  // that renders at the current row height — so the layout step below never
  // has to guess.
  let renderItems = [];

  $: shuffledPopulationData = shuffleByEdat(populationData);

  // The static SVG and the animated GIF for one figure aren't guaranteed to
  // share an aspect ratio, and both need to render at the full row height
  // without ever shrinking — so the figure's width is whichever of the two
  // needs more room at that height.
  async function figureWidth(h, rowHeight) {
    if (!h.staticSrc) return rowHeight; // "not included" grey dot: square box

    const staticDims = await getImageDimensions(h.staticSrc);
    const staticWidth = rowHeight * (staticDims.width / staticDims.height);
    if (!h.animatedSrc) return staticWidth;

    const animatedDims = await getImageDimensions(h.animatedSrc);
    const animatedWidth =
      rowHeight * (animatedDims.width / animatedDims.height);
    return Math.max(staticWidth, animatedWidth);
  }

  async function buildRenderItems(data, rowHeight) {
    const enriched = data.map((human) => ({
      ...human,
      ...resolveArtwork(human),
    }));

    const uniqueSrcs = [
      ...new Set(
        enriched.flatMap((h) => [h.staticSrc, h.animatedSrc]).filter(Boolean),
      ),
    ];
    await preloadImageDimensions(uniqueSrcs);

    renderItems = await Promise.all(
      enriched.map(async (h) => ({
        ...h,
        width: await figureWidth(h, rowHeight),
        fit: await getFigureFit(h.staticSrc, h.animatedSrc),
      })),
    );
  }

  $: buildRenderItems(shuffledPopulationData, config.imageHeight);

  // ── 3. Layout: two independently centred blocks ─────────────────────────
  // The "selected" group and "the rest" are laid out separately — each one
  // wraps into its own rows and centres each row on its own — then stacked
  // with a visible gap between them. This is what keeps a 10-figure group
  // and a 90-figure group both looking right regardless of how uneven the
  // split is.
  $: includedItems = renderItems.filter((i) => i.isActive);
  $: excludedItems = renderItems.filter((i) => !i.isActive);

  $: includedLayout = layoutCenteredRows(
    includedItems.map((i) => i.width),
    config.imageHeight,
    config.HORIZONTAL_SPACING,
    config.VERTICAL_SPACING,
    containerWidth || 1200,
  );
  $: excludedLayout = layoutCenteredRows(
    excludedItems.map((i) => i.width),
    config.imageHeight,
    config.HORIZONTAL_SPACING,
    config.VERTICAL_SPACING,
    containerWidth || 1200,
  );

  $: separationY =
    LAYOUT_CONSTANTS.SEPARATION_ROWS *
    (config.imageHeight + config.VERTICAL_SPACING);
  // The excluded block starts below the whole included block, with the gap.
  $: excludedOffsetY = includedLayout.totalHeight + separationY;
  $: gridHeight =
    renderItems.length > 0
      ? excludedOffsetY + excludedLayout.totalHeight
      : LAYOUT_CONSTANTS.DEFAULT_GRID_HEIGHT;

  // The grid only has real content once renderItems resolves, but the
  // container div (below) is always mounted precisely so this re-measure
  // lands correctly the moment there's something to lay out.
  $: if (renderItems.length > 0) measureContainerWidth();

  // ── 4. Animation: every figure travels to its place in the layout above ─
  // One continuous movement per figure (see animateFigures). A new run always
  // stops the previous one first and starts from wherever the figures are, so
  // changing a filter halfway through never makes them jump.
  let startTimer;
  let stopAnimation = () => {};

  function animateCircles() {
    if (!containerDiv) return;

    stopAnimation();

    const figures = getFigures(containerDiv);
    const targets = buildTargets(
      figures,
      includedLayout.positions,
      excludedLayout.positions,
      excludedOffsetY,
    );

    stopAnimation = animateFigures(
      figures,
      targets,
      renderItems.map((item) => item.width),
      containerWidth,
      gridHeight,
      config.imageHeight,
    );
  }

  function scheduleAnimation() {
    clearTimeout(startTimer);
    startTimer = setTimeout(animateCircles, LAYOUT_CONSTANTS.ANIMATION_START_DELAY);
  }

  $: if (renderItems.length > 0 && containerWidth > 0) scheduleAnimation();

  onDestroy(() => {
    clearTimeout(startTimer);
    stopAnimation();
  });
</script>

<!-- ── 5. Template ──────────────────────────────────────────────────────── -->
<!-- Always mounted, even before renderItems resolves, so onMount can measure
     its real width right away instead of racing an {#if}. -->
<div class="flex mt-5" bind:this={containerDiv}>
  {#if renderItems.length > 0}
    <div data-grid class="relative w-full" style="height: {gridHeight}px;">
      {#each renderItems as item (item.id)}
        <PopulationImage {item} height={config.imageHeight} />
      {/each}
    </div>
  {:else if populationData.length === 0}
    <div class="w-full py-12 px-4 bg-white text-center text-gray-500">
      No data to display
    </div>
  {/if}
</div>
