import { writable } from "svelte/store";
import objectiusData from "$lib/data/Processed/objectius.json";

// Mateixa icona i color que ja fem servir a EixosOverview per a cada grup
// (aparellat pel seu ObjectiuGeneralId, no per la posició). El nom és el
// de l'arxiu dins src/lib/icons/Lucide/, llegit per <Icon name={...} />.
const iconByGrupId = {
  1: { icon: "leaf", iconColor: "#00ADAB" }, // Esperança de vida
  2: { icon: "leaf", iconColor: "#D0C4FF" }, // Mortalitat evitable
  3: { icon: "search-check", iconColor: "#5EEBEF" }, // Factors protectors i de risc
  4: { icon: "activity", iconColor: "#FF8F68" }, // Morbiditat
};

export const objectiusGrups = writable(
  objectiusData.map((grup) => ({ ...grup, ...iconByGrupId[grup.id] })),
);
