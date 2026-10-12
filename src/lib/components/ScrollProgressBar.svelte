<script>
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { tweened } from "svelte/motion";

  const progress = tweened(0, {
    duration: 250,
  });

  function updateProgress() {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const nextProgress =
      scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

    progress.set(Math.max(0, Math.min(1, nextProgress)));
  }

  afterNavigate(updateProgress);

  onMount(() => {
    updateProgress();

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  });
</script>

<div
  class="fixed left-0 right-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-[#2e3a59] via-[#2d7a8a] to-[#2e3a59]"
  style:transform={"scaleX(" + $progress + ")"}
/>
