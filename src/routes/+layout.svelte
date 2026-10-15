<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { page } from "$app/stores";
  import "../app.css";
  import Header from "$lib/components/Header.svelte";
  import Navigation from "$lib/components/Navigation.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import LoadingScreen from "$lib/components/LoadingScreen.svelte";
  import ScrollProgressBar from "$lib/components/ScrollProgressBar.svelte";

  let siteHeader;
  // El contingut de les seccions només es munta al navegador (fa servir d3,
  // motion i mesures del DOM): al prerender només es veu la pantalla de càrrega.
  let isMounted = false;

  // L'alçada real de la capçalera fixada es publica com a variable CSS
  // (--site-header-h) perquè els blocs `sticky` de les seccions es fixin just
  // sota la capçalera sense números fixos.
  // Es mesura en lloc de fixar-la perquè canvia si el títol passa a dues línies.
  onMount(() => {
    isMounted = true;
    const publish = () =>
      document.documentElement.style.setProperty(
        "--site-header-h",
        `${siteHeader.offsetHeight}px`,
      );
    const observer = new ResizeObserver(publish);
    observer.observe(siteHeader);
    publish();
    return () => observer.disconnect();
  });
</script>

<div
  bind:this={siteHeader}
  id="site-header"
  class="sticky top-0 z-50 [--page-margin:1rem] lg:[--page-margin:10%]"
>
  <Header />
  <Navigation />
</div>

<ScrollProgressBar />

<div class="flex flex-col min-h-screen">
  <main id="main-content" class="flex-grow">
    {#if isMounted}
      {#key $page.url.pathname}
        <div in:fade={{ duration: 400 }}>
          <slot />
        </div>
      {/key}
    {:else}
      <LoadingScreen />
    {/if}
  </main>
  <Footer />
</div>

<style>
  /* Distància entre el menú de navegació i el títol de cada secció. Els blocs
	   `sticky` es fixen just sota la capçalera (`top: var(--site-header-h)`),
	   així aquesta distància és la mateixa en posició inicial i ja fixats. */
  :global(:root) {
    --section-top-gap: 35px;
  }
</style>
