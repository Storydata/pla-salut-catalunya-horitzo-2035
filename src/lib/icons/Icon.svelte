<script>
  // Un únic punt per pintar qualsevol icona del projecte, vinguin de Lucide,
  // de Material Symbols o siguin pròpies -- sense dependència externa, tots
  // els SVG viuen a src/lib/icons/Lucide/ i src/lib/icons/material/. Veure
  // README.md d'aquesta carpeta per afegir-ne de nous.
  import { buildIconMarkup } from "./buildIconMarkup.js";

  export let name; // nom de fitxer sense extensió, p. ex. "chevron-down"
  export let size = undefined; // px -- si no es dóna, la mida la controla `class`
  export let color = undefined; // si no es dóna, hereta el color per CSS (p. ex. text-*)
  export let strokeWidth = undefined; // només afecta les icones Lucide

  const lucideIcons = import.meta.glob("./Lucide/*.svg", {
    query: "?raw",
    import: "default",
    eager: true,
  });
  const materialIcons = import.meta.glob("./material/*.svg", {
    query: "?raw",
    import: "default",
    eager: true,
  });

  function lookup(iconName) {
    const lucideKey = Object.keys(lucideIcons).find((p) =>
      p.endsWith(`/${iconName}.svg`),
    );
    if (lucideKey) return { raw: lucideIcons[lucideKey], family: "lucide" };
    const materialKey = Object.keys(materialIcons).find((p) =>
      p.endsWith(`/${iconName}.svg`),
    );
    if (materialKey)
      return { raw: materialIcons[materialKey], family: "material" };
    return null;
  }

  $: found = name ? lookup(name) : null;
  $: markup = found
    ? buildIconMarkup(found.raw, found.family, {
        size,
        color,
        strokeWidth,
        className: $$props.class,
      })
    : null;

  // Una icona que no existeix es veuria com un forat buit, sense cap error.
  // En desenvolupament ho diem a la consola perquè es trobi de seguida (nom
  // mal escrit, majúscules, o l'arxiu a la carpeta equivocada).
  $: if (name && !markup && import.meta.env.DEV) {
    console.warn(
      `[Icon] No s'ha trobat la icona "${name}" a src/lib/icons/Lucide/ ni a src/lib/icons/material/`,
    );
  }
</script>

{#if markup}
  {@html markup}
{:else if name}
  <span
    class={$$props.class}
    style="display:inline-block; width:{size ?? 24}px; height:{size ?? 24}px;"
    aria-hidden="true"
  ></span>
{/if}
