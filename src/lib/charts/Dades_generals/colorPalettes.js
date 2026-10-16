// Cada paleta va del valor més baix (color més clar) al més alt (més fosc): el
// mapa interpola entre el primer i l'últim color, i la llegenda els mostra en
// aquest ordre.
export const DONES_PALETTE = {
  colors: [
    "rgba(117, 68, 128, 0.1)", // 10%
    "rgba(117, 68, 128, 0.2)", // 20%
    "rgba(117, 68, 128, 0.4)", // 40%
    "rgba(117, 68, 128, 0.6)", // 60%
    "rgba(117, 68, 128, 0.8)", // 80%
    "rgba(117, 68, 128, 1)", // 100%
  ],
  label: "Menys <br> del 15%",
};

export const HOMES_PALETTE = {
  colors: [
    "rgba(38, 170, 170, 0.1)", // 10%
    "rgba(38, 170, 170, 0.2)", // 20%
    "rgba(38, 170, 170, 0.4)", // 40%
    "rgba(38, 170, 170, 0.6)", // 60%
    "rgba(38, 170, 170, 0.8)", // 80%
    "rgba(38, 170, 170, 1)", // 100%
  ],
  label: "Més <br> del 90%",
};
