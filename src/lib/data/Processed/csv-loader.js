import * as d3 from "d3";

// Tots els CSV d'indicadors, agrupats en una carpeta per Objectiu de salut
// (esperanca_de_vida, mortalitat_evitable, morbiditat, factors_de_risc), com
// enllaça objectius.json; els que encara no en tenen van a "pendents". Un CSV
// nou només cal deixar-lo a la seva carpeta: no s'ha de registrar aquí.
// Les claus són rutes relatives, p. ex. "./factors_de_risc/PS3_1_final.csv".
const rawCsvFiles = import.meta.glob("./*/*.csv", {
  query: "?raw",
  import: "default",
  eager: true,
});

// `filename` és el `dataFile` de categories.json / indicadors.json sense
// l'extensió, p. ex. "factors_de_risc/PS3_1_final".
export function loadIndicatorCSV(filename) {
  try {
    const rawData = rawCsvFiles[`./${filename}.csv`];

    if (!rawData) {
      console.warn(`Unknown CSV file: ${filename}`);
      return [];
    }

    return d3.csvParse(rawData, d3.autoType);
  } catch (error) {
    console.error(`✗ Failed to load ${filename}:`, error);
    return [];
  }
}
