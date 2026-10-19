import * as aq from "arquero";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cada CSV processat va a la carpeta de l'Objectiu de salut del qual penja
// (el que l'enllaça a objectius.json): morbiditat, factors_de_risc, etc. Els que
// encara no tenen Objectiu assignat a l'Excel van a "pendents".
const fileConfigs = [
  {
    ageGroup: "Adults",
    rawName: "OSLO_index2",
    edatTots: "E65M",
    outputDir: "../Processed/pendents",
    outputName: "OSLO_index2_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "CONS_TABAC_R",
    outputDir: "../Processed/factors_de_risc",
    outputName: "CONS_TABAC_R_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "CONS_TABAC",
    outputDir: "../Processed/factors_de_risc",
    outputName: "CONS_TABAC_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "SON_R",
    outputDir: "../Processed/factors_de_risc",
    outputName: "SON_R_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "EQ4_R",
    outputDir: "../Processed/pendents",
    outputName: "EQ4_R_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "COBERTURA",
    outputDir: "../Processed/pendents",
    outputName: "COBERTURA_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "ACT_INT_MOD",
    outputDir: "../Processed/factors_de_risc",
    outputName: "ACT_INT_MOD_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "PS3_1",
    outputDir: "../Processed/factors_de_risc",
    outputName: "PS3_1_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "PS3_3",
    outputDir: "../Processed/factors_de_risc",
    outputName: "PS3_3_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "PS3_2",
    outputDir: "../Processed/factors_de_risc",
    outputName: "PS3_2_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "PS3_18",
    outputDir: "../Processed/morbiditat",
    outputName: "PS3_18_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "PS3_19",
    outputDir: "../Processed/morbiditat",
    outputName: "PS3_19_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "AUTONOMIA",
    edatTots: "E65M",
    outputDir: "../Processed/pendents",
    outputName: "AUTONOMIA_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "GALI",
    edatTots: "E65M",
    outputDir: "../Processed/pendents",
    outputName: "GALI_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "SWEMWBS_index",
    outputDir: "../Processed/factors_de_risc",
    outputName: "SWEMWBS_index_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "PMgreu",
    outputDir: "../Processed/pendents",
    outputName: "PMgreu_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "FRUITAVERDURA_R",
    outputDir: "../Processed/factors_de_risc",
    outputName: "FRUITAVERDURA_R_adults_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "IMC_CAT_15imes_R",
    outputDir: "../Processed/factors_de_risc",
    outputName: "IMC_CAT_15imes_R_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "BEGSUCRE",
    outputDir: "../Processed/factors_de_risc",
    outputName: "BEGSUCRE_adults_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "DIETAMEDIT",
    outputDir: "../Processed/pendents",
    outputName: "DIETAMEDIT_final.csv",
  },
  {
    ageGroup: "Adults",
    rawName: "IMC_CAT_15imes",
    outputDir: "../Processed/factors_de_risc",
    outputName: "IMC_CAT_15imes_final.csv",
  },
  {
    ageGroup: "Infants",
    rawName: "IMC_CAT_OMS_0_19_Sobrepes",
    edatTots: "E014",
    outputDir: "../Processed/factors_de_risc",
    outputName: "IMC_CAT_OMS_0_19_Sobrepes_final.csv",
  },
  {
    ageGroup: "Infants",
    rawName: "IMC_CAT_OMS_0_19_Obsitat",
    edatTots: "E014",
    outputDir: "../Processed/factors_de_risc",
    outputName: "IMC_CAT_OMS_0_19_Obsitat_final.csv",
  },
  {
    ageGroup: "Infants",
    rawName: "FRUITAVERDURA_R",
    edatTots: "E014",
    outputDir: "../Processed/factors_de_risc",
    outputName: "FRUITAVERDURA_R_infants_final.csv",
  },
  {
    ageGroup: "Infants",
    rawName: "BEGSUCRE",
    edatTots: "E014",
    outputDir: "../Processed/factors_de_risc",
    outputName: "BEGSUCRE_infants_final.csv",
  },
  {
    ageGroup: "Infants",
    rawName: "LACTANCIAMATERNA_6M",
    edatTots: "E014",
    outputDir: "../Processed/factors_de_risc",
    outputName: "LACTANCIAMATERNA_6M_final.csv",
  },
  {
    ageGroup: "Infants",
    rawName: "Oci_actiu",
    edatTots: "E014",
    outputDir: "../Processed/factors_de_risc",
    outputName: "Oci_actiu_final.csv",
  },
  {
    ageGroup: "Infants",
    rawName: "Oci_sedentari",
    edatTots: "E014",
    outputDir: "../Processed/pendents",
    outputName: "Oci_sedentari_final.csv",
  },
];

const normalizeCode = (value, replacements) => replacements[value] ?? value;

const EDAT_LABELS = {
  E014: "0-14",
  E1544: "15-44",
  E4564: "45-64",
  E65M: "65 i més",
  All: "Tots",
};

const transformData = (data, edatTots) =>
  aq
    .from(data)
    .select(
      "ANY",
      "ANY_MIN",
      "ANY_ALL",
      "INDICADOR",
      "RS",
      "EDAT",
      "SEXE",
      "ESTUDIS",
      "CLASSE",
      "ORIGEN",
      "R",
      "N",
      "E",
    )
    .rename({
      ANY: "Any",
      ANY_MIN: "Any_min",
      ANY_ALL: "Any_all",
      INDICADOR: "Name",
      RS: "Regio",
      EDAT: "Edat",
      SEXE: "Sexe",
      ESTUDIS: "Estudis",
      CLASSE: "Classe",
      ORIGEN: "Origen",
      R: "Indicador",
      N: "Muestra",
      E: "Tasa",
    })
    .derive({
      Indicador: aq.escape((d) => (isNaN(d.Indicador) ? 0 : d.Indicador)),
      Tasa: aq.escape((d) => (isNaN(d.Tasa) ? 0 : d.Tasa)),
      Any: aq.escape((d) => (isNaN(d.Any) ? 2025 : d.Any)),
    })
    .derive({
      Muestra: aq.escape((d) => +d.Muestra),
      Indicador: aq.escape((d) => +d.Indicador),
      Tasa: aq.escape((d) => +d.Tasa),
    })
    .derive({
      Regio: aq.escape((d) =>
        // Apòstrof corbat als noms de regió (com al GeoJSON del mapa).
        normalizeCode(d.Regio, { All: "Catalunya" })?.replace("\u0027", "\u2019"),
      ),
      // Display label keeps the real age range even when Edat is
      // normalized to "Tots" for single-age-group files below
      Edat_label: aq.escape((d) =>
        d.Edat === edatTots
          ? `Tots (${EDAT_LABELS[edatTots]})`
          : normalizeCode(d.Edat, EDAT_LABELS),
      ),
      // edatTots marks the only age code in the file, so it acts as
      // the total group
      Edat: aq.escape((d) =>
        d.Edat === edatTots ? "Tots" : normalizeCode(d.Edat, EDAT_LABELS),
      ),
      Sexe: aq.escape((d) =>
        normalizeCode(d.Sexe, {
          All: "Tots",
          F: "Dona",
          M: "Home",
        }),
      ),
      Classe: aq.escape((d) =>
        normalizeCode(d.Classe, {
          All: "Tots",
          I: "Alta",
          II: "Mitjana",
          III: "Baixa",
        }),
      ),
      Estudis: aq.escape((d) =>
        normalizeCode(d.Estudis, {
          All: "Tots",
          P: "Primària",
          S: "Secundària",
          U: "Universitat",
        }),
      ),
      Origen: aq.escape((d) =>
        normalizeCode(d.Origen, {
          All: "Tots",
          0: "No",
          1: "Si",
        }),
      ),
    })
    .filter(
      (d) =>
        d.Estudis != "" &&
        d.Estudis != "A" &&
        d.Estudis != "NA" &&
        d.Classe != "" &&
        d.Edat != "" &&
        d.Regio != "" &&
        d.Sexe != "",
    )
    .orderby(aq.desc("Any"));

for (const fileConfig of fileConfigs) {
  const outputDir = path.resolve(__dirname, fileConfig.outputDir);
  const inputPath = path.resolve(
    __dirname,
    `./${fileConfig.ageGroup}/${fileConfig.rawName}.csv`,
  );
  const csvText = fs.readFileSync(inputPath, "utf8");
  const data = aq.fromCSV(csvText);
  const dataTable = transformData(data, fileConfig.edatTots);
  const outputPath = path.join(outputDir, fileConfig.outputName);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, dataTable.toCSV());

  // console.log(`CSV saved: ${outputPath}`);
  // console.log(`Rows: ${dataTable.numRows()}`);
}
