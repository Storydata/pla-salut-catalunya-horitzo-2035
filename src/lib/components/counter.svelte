<script>
  import { onDestroy } from "svelte";

  export let startValue = 0;
  export let endValue = 0;
  export let duration = 3;
  export let color = "#2E3A59";
  export let label = "persones al 2024 a Catalunya";
  export let suffix = "";
  export let decimals = 0;

  let counterEl;
  let currentValue = startValue;
  let isInView = false;
  let observer;
  let frameId;

  $: formattedValue = currentValue.toLocaleString("ca-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const easeInOutQuad = (progress) =>
    progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

  const animateCounter = () => {
    cancelAnimationFrame(frameId);
    currentValue = startValue;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const updateCounter = () => {
      const now = Date.now();

      if (now >= endTime) {
        currentValue = endValue;
        return;
      }

      const progress = (now - startTime) / (duration * 1000);
      const raw =
        startValue + (endValue - startValue) * easeInOutQuad(progress);
      currentValue =
        decimals > 0 ? Number(raw.toFixed(decimals)) : Math.floor(raw);

      frameId = requestAnimationFrame(updateCounter);
    };

    frameId = requestAnimationFrame(updateCounter);
  };

  $: if (counterEl && !observer) {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || isInView) {
          return;
        }

        isInView = true;
        animateCounter();
        observer?.disconnect();
      },
      { threshold: 0.3 },
    );

    observer.observe(counterEl);
  }

  onDestroy(() => {
    observer?.disconnect();
    cancelAnimationFrame(frameId);
  });
</script>

<div
  bind:this={counterEl}
  class:opacity-100={isInView}
  class:translate-y-0={isInView}
  class="mt-0 flex translate-y-[-20px] flex-col items-center gap-4 text-center opacity-0 transition-[opacity,transform] duration-1000 ease-out will-change-[transform,opacity] md:mt-[120px]"
  style:--counter-color={color}
>
  <span class="text-4xl font-light text-[var(--counter-color)]">
    {formattedValue}{suffix}
  </span>
  <span class="text-sm text-[#2E3A59]">{label}</span>
</div>
