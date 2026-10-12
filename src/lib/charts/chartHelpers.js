import * as d3 from "d3";

export const sexes = ["Dona", "Home", "Tots"];

const colorMap = {
  Dona: "#754480",
  Home: "#26AAAA",
  Tots: "#FF9671",
};

export const getColor = (sex) => colorMap[sex];
export const getColorLabel = getColor;

export const lineChartButtonClasses = {
  active:
    "!bg-[#2E3A59] !text-white !border-transparent hover:!bg-[#2E3A59] hover:!text-white focus:!text-white focus-visible:!text-white active:!text-white",
  inactive:
    "!bg-[#F1F3F6] !text-[#828898] !border-transparent hover:!bg-[#E4E7EC] hover:!text-[#828898]",
};

const filterSelectBase =
  "px-3 py-1.5 text-sm font-medium rounded-lg border-none cursor-pointer focus:outline-none focus:ring-0";

export const filterSelectClasses = {
  active: `${filterSelectBase} bg-[#2E3A59] text-white`,
  inactive: `${filterSelectBase} bg-[#F1F3F6] text-[#828898] hover:bg-[#E4E7EC]`,
};

export const lineChartSvgColors = {
  gridStroke: "#b9b8bb",
  axisStroke: "#8b898e",
  textFill: "#4C4F51",
  labelBackground: "white",
  differencePositive: "#2ecc71",
  differenceNegative: "#e74c3c",
  differenceNeutral: "#999",
  // Thin line joining a value to the point it belongs to.
  leaderStroke: "#a3a3a3",
};

const lineChartSexeColors = {
  Tots: "#EA4D50",
  Dona: "#754480",
  Home: "#26AAAA",
};

// Darkest tone first: youngest, highest class, highest studies.
const lineChartCategoryOrderings = {
  Edat: ["15-44", "45-64", "65 i més"],
  ClasseSocial: ["Alta", "Mitjana", "Baixa"],
  Estudis: ["Universitat", "Secundaria", "Primaria"],
};

const lineChartSubtotalColor = "#FF9671";

const lineChartCategoryRamps = {
  Tots: ["#EA4D50", "#FE8992", "#FFB0B6"],
  Dona: ["#754480", "#AC8FB3", "#C8B4CC"],
  Home: ["#26AAAA", "#7DCCCC", "#A8DDDD"],
};

export const getLineColor = (name, sexe, filterType, groupField, categories) => {
  if (groupField === "Sexe") return lineChartSexeColors[name];

  // A "Tots" line is the grand total when no sex is picked, a subtotal otherwise.
  if (name === "Tots")
    return sexe === "Tots" ? lineChartSexeColors.Tots : lineChartSubtotalColor;

  const ramp = lineChartCategoryRamps[sexe] ?? lineChartCategoryRamps.Tots;
  const ordering = lineChartCategoryOrderings[filterType] ?? categories;
  const index = ordering.indexOf(name);
  return ramp[(index === -1 ? 0 : index) % ramp.length];
};

// Line colors double as end-label text; clamp lightness so pale hues stay readable on white
export const getLineLabelColor = (color) => {
  const lab = d3.lab(color);
  if (lab.l > 55) lab.l = 55;
  return lab.formatHex();
};

// Space between two groups of bars (Per edat, Per Territori...), as the
// `padding` of their d3 band scale: the share of a group's height left empty
// around it. 0.14 leaves ~8px of visible white between the last bar of a group
// and the first of the next one (the thinner "Tots" bar adds ~2px of its own).
export const BAR_GROUP_PADDING = 0.14;

// Height a band scale with that padding needs for `count` groups of
// `groupHeight` px each, so the chart's height follows its content and a
// tighter padding makes the chart shorter instead of fatter.
export const barGroupsExtent = (count, groupHeight) =>
  count > 0
    ? (groupHeight * (count + BAR_GROUP_PADDING)) / (1 - BAR_GROUP_PADDING)
    : 0;

export const BAR_CHART_CONFIG = {
  width: 1100,
  height: 360,
  margin: { top: 60, right: 0, bottom: 70, left: 40 },
};

export const baseRegionFilter = (d) =>
  d.Regio !== "Tots" &&
  d.Edat === "Tots" &&
  d.Estudis === "Tots" &&
  d.Classe === "Tots" &&
  d.Indicador !== undefined &&
  d.Indicador !== null &&
  d.Indicador !== "" &&
  d.Any === 2025;

//Make a dot appear as comma
export const fmtPct = (value) =>
  value === undefined || value === null || Number.isNaN(+value)
    ? ""
    : d3.format(".1f")(+value).replace(".", ",");
