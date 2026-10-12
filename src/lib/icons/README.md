# Iconos del proyecto

Todos los iconos viven aquí como archivos `.svg` sueltos, sin depender de
ninguna librería externa (`lucide-svelte` ya no es una dependencia del
proyecto). Se usan siempre a través de un único componente:

```svelte
<script>
  import Icon from "$lib/icons/Icon.svelte";
</script>

<Icon name="chevron-down" />
<Icon name="heart-pulse" class="h-6 w-6" color="#00ADAB" />
<Icon name="chevron-down" size={24} strokeWidth={1.5} />
```

## Estructura

```
src/lib/icons/
  Icon.svelte           <- el único componente que pinta iconos
  buildIconMarkup.js    <- prepara cada SVG (color, tamaño, recortes); no tocar
  Lucide/*.svg          <- iconos de Lucide (lucide.dev)
  material/*.svg        <- iconos de Google Material Symbols e iconos propios
```

`Icon.svelte` busca el nombre primero en `Lucide/`, luego en `material/`.
El `name` es simplemente el nombre del archivo sin `.svg`.

## Cómo añadir un icono nuevo

**Lucide**: entra en https://lucide.dev/icons, busca el icono, descarga el
SVG y guárdalo en `Lucide/` con el mismo nombre que aparece en la web (en
minúsculas y con guiones, por ejemplo `heart-pulse`).

**Material Symbols**: entra en https://fonts.google.com/icons y antes de
descargar fija estos valores (son los que usa todo el proyecto, para que
los iconos de Google se vean iguales entre sí):

| Ajuste | Valor |
|---|---|
| Estilo | **Rounded** |
| Weight | **400** |
| Fill | 0 |
| Grade | 0 |
| Optical size | 24 |

Descarga el SVG y guárdalo en `material/` con el nombre que muestra el
selector de Google (minúsculas y guion bajo, por ejemplo `vape_free`).

**Icono propio** (uno modificado o dibujado por nosotros): guárdalo también
en `material/`, con el nombre que quieras (`elderly_woman`). Debe ser de un
solo color. Si lo exportas desde Figma, Illustrator o Inkscape, no hace falta
limpiarlo.

No hace falta tocar `Icon.svelte` ni ningún otro archivo: en cuanto el
`.svg` está en la carpeta correcta, ya se puede usar con
`<Icon name="..." />`.

## Qué hace `Icon.svelte` por ti

Los SVG llegan de sitios distintos y cada uno trae sus propias costumbres.
`buildIconMarkup.js` las unifica, así que no hay que editar los archivos a mano:

- **Color**: lo decide siempre el CSS (la prop `color` o una clase `text-*`).
  Si el archivo trae un color fijo (la web de Google descarga los SVG con
  `fill="#1f1f1f"`, Illustrator con clases `.cls-1`), se sustituye por el
  color del texto.
- **Tamaño**: manda la prop `size` o la clase (`h-6 w-6`). El ancho y alto
  que traiga el archivo se ignoran, pero se garantiza que haya `viewBox`.
- **Sin recortes**: un SVG oculta por defecto lo que se sale de su caja. Con
  `rounded-full` y `p-3` esa caja es un círculo pequeño que corta las
  esquinas del icono, por eso todos se pintan con `overflow: visible`.
- **Icono que no aparece**: si el nombre no coincide con ningún archivo, el
  hueco queda vacío y en desarrollo (`npm run dev`) la consola del navegador
  avisa con `[Icon] No s'ha trobat la icona "..."`. Casi siempre es una errata
  en el nombre, una mayúscula, o el archivo en la carpeta equivocada.

## Por qué existe esto

El proyecto está pensado para durar varios años. Si dependiéramos de
`lucide-svelte` como paquete de npm, cualquier actualización (o su
desaparición) podría romper iconos ya en producción sin aviso. Con los SVG
guardados dentro del propio proyecto, nada cambia a menos que lo cambiemos
nosotros.
