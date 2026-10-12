import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';
import { loadIndicatorCSV } from "$lib/data/Processed/csv-loader.js";
import { dataStore, subcategoryDataStore } from "$lib/stores/stores";
import indicadors from "$lib/data/Processed/indicadors.json";
import geojsonRaw from "$lib/data/Region/Regions-2decimal.geojson?raw";

// Les analítiques de Vercel només tenen sentit a Vercel: el workflow de GitHub
// Pages posa VITE_DISABLE_ANALYTICS perquè no demani un script que no existeix.
if (!import.meta.env.VITE_DISABLE_ANALYTICS) {
	injectAnalytics({
		mode: dev ? 'development' : 'production'
	});
}

export const prerender = true;
// Cada ruta es genera com a `<ruta>/index.html`: funciona igual a Vercel i a
// qualsevol hosting estàtic, sense dependre de la reescriptura d'URL.
export const trailingSlash = 'always';

// Es carrega al layout perquè les dades són compartides per totes les seccions
// i no s'han de tornar a carregar en canviar de ruta.
export async function load() {
  // Carrega tots els CSV d'indicadors de indicadors.json (una fila per dataset;
  // la clau que es fa servir arreu és `id`, p. ex. "ACT_INT_MOD_adults"). Són les
  // dades dels Objectius de salut: cada objectiu hi enllaça pel seu `datasetId`
  // (objectius.json). Els eixos estratègics no tenen CSV: tenen línies i intervencions.
  const subcategoryData = {};
  indicadors.forEach((indicador) => {
    const filename = indicador.dataFile.replace(".csv", "");
    subcategoryData[indicador.id] = loadIndicatorCSV(filename);
  });

  // Store data globally
  const geojson = JSON.parse(geojsonRaw);
  dataStore.set({
    regionsGeoJson: geojson,
  });
  subcategoryDataStore.set(subcategoryData);
  return {
    subcategoryData,
  };
}
