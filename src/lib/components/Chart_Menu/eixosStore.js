import { writable } from "svelte/store";
import intervencions from "$lib/data/Processed/intervencions.json";
import Icon1 from "$lib/assets/Ambits-Pla-Salut-color-nou-1.svg";
import Icon2 from "$lib/assets/Ambits-Pla-Salut-color-nou-2.svg";
import Icon3 from "$lib/assets/Ambits-Pla-Salut-color-nou-3.svg";
import Icon4 from "$lib/assets/Ambits-Pla-Salut-color-nou-4.svg";
import Icon5 from "$lib/assets/Ambits-Pla-Salut-color-nou-5.svg";
import Icon6 from "$lib/assets/Ambits-Pla-Salut-color-nou-6.svg";

// Cada eix té sempre el mateix dibuix associat al seu EixId (no a la posició
// en què surt a la web), perquè un canvi d'ordre a l'Excel no mogui les
// il·lustracions a un eix equivocat. El número de l'arxiu coincideix amb l'EixId.
const iconByEixId = {
  1: Icon1, // Néixer, créixer i viure saludablement
  2: Icon2, // Generar salut des dels territoris i entorns
  3: Icon3, // Enfortir la salut mental (lila)
  4: Icon4, // Envellir amb salut i autonomia (blau)
  5: Icon5, // Protegir el medi ambient i el clima (groc)
  6: Icon6, // Garantir una atenció centrada en la persona i orientada al valor
};

export const eixos = writable(
  intervencions.map((eix) => ({ ...eix, icon: iconByEixId[eix.id] })),
);
