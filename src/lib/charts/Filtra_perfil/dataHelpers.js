export const YEAR = "2025";
export const NO_DATA_MESSAGE = "La mostra de la ESCA no permet aquesta anàlisi";

const AGE_ORDER = ["0-14", "15-44", "45-64", "65 i més"];
const FILTER_FIELDS = ["edat", "sexe", "estudis", "classe"];
const CSV_FIELD_MAP = {
  edat: "Edat",
  sexe: "Sexe",
  estudis: "Estudis",
  classe: "Classe",
};

// Rows the animation can use: current year, Catalunya, no Origen split.
function isBaseRow(r) {
  return (
    String(r.Any) === YEAR && r.Regio === "Catalunya" && r.Origen === "Tots"
  );
}

function compareBySexeEdat(a, b) {
  if (a.sexe !== b.sexe) return a.sexe === "Dona" ? -1 : 1;
  return AGE_ORDER.indexOf(a.edat) - AGE_ORDER.indexOf(b.edat);
}

export function buildFilterOptions(dataRaw) {
  const rows = (dataRaw ?? []).filter((r) => String(r.Any) === YEAR);
  const unique = (column) =>
    [...new Set(rows.map((r) => r[column]))].filter((v) => v && v !== "");
  return {
    edats: unique("Edat"),
    sexes: unique("Sexe"),
    estudis: unique("Estudis"),
    classes: unique("Classe"),
  };
}

export function initializeFilters() {
  return Object.fromEntries(FILTER_FIELDS.map((field) => [field, "Tots"]));
}

export function filterDataBySelection(dataRaw, filters) {
  const filtered = dataRaw.filter(
    (row) =>
      isBaseRow(row) &&
      FILTER_FIELDS.every(
        (field) => row[CSV_FIELD_MAP[field]] === filters[field],
      ),
  );
  return filtered.length > 0 ? filtered : null;
}

export function buildStats(filtered) {
  const indicador = filtered?.[0]?.Indicador;
  if (!indicador || indicador === 0 || indicador === "0") {
    return { percentage: NO_DATA_MESSAGE, unit: "%", marge: null };
  }
  // Marge d'error of the same row; 0 means missing, as with Indicador.
  const marge = +filtered[0].Tasa;
  return { percentage: indicador, unit: "%", marge: marge > 0 ? marge : null };
}

export function extractDemographicSegments(dataRaw) {
  const totalRow = dataRaw.find(
    (r) =>
      isBaseRow(r) &&
      r.Edat === "Tots" &&
      r.Sexe === "Tots" &&
      r.Estudis === "Tots" &&
      r.Classe === "Tots",
  );
  const totalMuestra = totalRow?.Muestra;

  const isBreakdownRow = (r) =>
    isBaseRow(r) &&
    r.Sexe !== "Tots" &&
    r.Estudis === "Tots" &&
    r.Classe === "Tots";

  let breakdownRows = dataRaw.filter(
    (r) => isBreakdownRow(r) && r.Edat !== "Tots",
  );

  // Infants files have a single age group mapped to Edat "Tots",
  // so fall back to the sexe-only breakdown when no sexe×edat rows exist.
  if (breakdownRows.length === 0) {
    breakdownRows = dataRaw.filter(
      (r) => isBreakdownRow(r) && r.Edat === "Tots",
    );
  }

  const segments = breakdownRows.map((d) => ({
    sexe: d.Sexe,
    edat: d.Edat,
    edatLabel: d.Edat_label,
    muestra: d.Muestra,
    proportion: d.Muestra / totalMuestra,
  }));

  segments.sort(compareBySexeEdat);
  return segments;
}

function distributeUnits(segments, totalUnits) {
  const results = segments.map((seg) => {
    const exact = (seg.normalizedProportion || seg.proportion) * totalUnits;
    return {
      ...seg,
      exact,
      integer: Math.floor(exact),
      remainder: exact - Math.floor(exact),
    };
  });

  const allocated = results.reduce((sum, r) => sum + r.integer, 0);
  const remainder = totalUnits - allocated;

  results.sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; i < remainder; i++) {
    results[i].integer++;
  }

  return results.map((r) => r.integer);
}

export function generatePopulationUnits(
  segments,
  percentage = null,
  filters = {},
) {
  if (!segments || segments.length === 0) return [];

  let matchingSegments = segments;

  if (filters.sexe && filters.sexe !== "Tots") {
    matchingSegments = segments.filter((s) => s.sexe === filters.sexe);
  }
  if (filters.edat && filters.edat !== "Tots") {
    matchingSegments = matchingSegments.filter((s) => s.edat === filters.edat);
  }

  if (matchingSegments.length === 0) {
    matchingSegments = segments;
  }

  const totalProportion = matchingSegments.reduce(
    (sum, s) => sum + s.proportion,
    0,
  );
  const normalizedSegments = matchingSegments.map((s) => ({
    ...s,
    normalizedProportion: s.proportion / totalProportion,
  }));

  if (percentage !== null) {
    const activeCount = Math.round(Number(percentage) || 0);
    const inactiveCount = 100 - activeCount;

    const activeUnitsPerSegment = distributeUnits(
      normalizedSegments,
      activeCount,
    );
    const inactiveUnitsPerSegment = distributeUnits(
      normalizedSegments,
      inactiveCount,
    );

    const units = [];
    let unitIndex = 0;

    normalizedSegments.forEach((segment, segIndex) => {
      const activeCountForSeg = activeUnitsPerSegment[segIndex];
      const inactiveCountForSeg = inactiveUnitsPerSegment[segIndex];

      for (let i = 0; i < activeCountForSeg; i++) {
        units.push({
          id: `unit-${unitIndex}`,
          index: unitIndex,
          sexe: segment.sexe,
          edat: segment.edat,
          edatLabel: segment.edatLabel,
          isActive: true,
        });
        unitIndex++;
      }

      for (let i = 0; i < inactiveCountForSeg; i++) {
        units.push({
          id: `unit-${unitIndex}`,
          index: unitIndex,
          sexe: segment.sexe,
          edat: segment.edat,
          edatLabel: segment.edatLabel,
          isActive: false,
        });
        unitIndex++;
      }
    });

    units.sort(compareBySexeEdat);

    return units;
  }

  const units = [];
  let unitIndex = 0;

  for (const segment of normalizedSegments) {
    const count = Math.round(segment.normalizedProportion * 100);
    for (let i = 0; i < count && unitIndex < 100; i++) {
      units.push({
        id: `unit-${unitIndex}`,
        index: unitIndex,
        sexe: segment.sexe,
        edat: segment.edat,
        edatLabel: segment.edatLabel,
      });
      unitIndex++;
    }
  }

  const lastSegment = normalizedSegments[normalizedSegments.length - 1];
  while (unitIndex < 100) {
    units.push({
      id: `unit-${unitIndex}`,
      index: unitIndex,
      sexe: lastSegment?.sexe ?? null,
      edat: lastSegment?.edat ?? null,
      edatLabel: lastSegment?.edatLabel ?? null,
    });
    unitIndex++;
  }

  units.sort(compareBySexeEdat);

  return units;
}

export function shuffleByEdat(data) {
  const result = [...data];
  const sexeGroups = {};

  result.forEach((item, idx) => {
    if (!item.sexe) return;
    if (!sexeGroups[item.sexe]) {
      sexeGroups[item.sexe] = [];
    }
    sexeGroups[item.sexe].push({ idx, edat: item.edat });
  });

  Object.values(sexeGroups).forEach((group) => {
    const edatValues = group.map((g) => g.edat);
    for (let i = edatValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [edatValues[i], edatValues[j]] = [edatValues[j], edatValues[i]];
    }
    group.forEach((item, i) => {
      result[item.idx].edat = edatValues[i];
    });
  });

  return result;
}
