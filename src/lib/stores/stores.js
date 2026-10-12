import { writable } from "svelte/store";

export const dataStore = writable(null);
export const subcategoryDataStore = writable({});
export const selectedSubcategoryStore = writable(null);
export const menuOpenStore = writable(false);
export const menuAtRootStore = writable(true);
// Filtered percentage from the "Filtra per veure un perfil" view, shown in the
// shared indicator header while that view is active.
export const perfilStatStore = writable(null);
// Marge d'error (raw column E, Tasa once processed) for the row the perfil
// filters land on, and the min/max across the lines the comparison chart
// draws for its latest year. Both feed the shared footnote.
export const perfilMargeStore = writable(null);
export const compararMargeStore = writable(null);
// { src, height } of the Datawrapper chart to show for "Metes i indicadors
// de seguiment", or null when not in that view. Set together with
// confirmedIntervencio in IndicadorViewer, mutually exclusive with viewing a
// normal indicator chart — only one of the two is visible at a time.
export const datawrapperStore = writable(null);
// Font (source) of the confirmed Objectiu de salut, shown in the shared
// ChartFootnote instead of its default text. Set together with
// confirmedObjectiu in IndicadorViewer, null outside that view.
export const objectiuFontStore = writable(null);
// Name of the indicator of the confirmed Objectiu de salut (e.g. "% de
// persones de 15 anys i més amb ansietat lleu"), shown next to the value in the
// shared header. Set from confirmedObjectiu in IndicadorViewer, null outside
// that view.
export const objectiuIndicadorStore = writable(null);
