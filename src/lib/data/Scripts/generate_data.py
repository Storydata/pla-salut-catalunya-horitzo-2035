"""
Genera els JSON de dades de la web a partir dels Excels de contingut:

  - intervencions: els 6 eixos estratègics -> línies -> intervencions. De cada
    intervenció pengen la fitxa en PDF i les metes i indicadors de seguiment
    (gràfic de Datawrapper).
  - objectius: els 4 Objectius de salut (Esperança de vida, Mortalitat evitable,
    Factors protectors i de risc, Morbiditat), cadascun amb el seu indicador i, si ja hi és,
    el CSV de dades (`datasetId`, de indicadors.json).

Ús (des de l'arrel del projecte):

    python3 src/lib/data/Scripts/generate_data.py intervencions \\
        src/lib/data/Scripts/excel-origen/Estructura_intervencions_Pla_de_salut.xlsx

    python3 src/lib/data/Scripts/generate_data.py objectius \\
        src/lib/data/Scripts/excel-origen/Objectius_generals_Pla_de_salut.xlsx

Genera src/lib/data/Processed/intervencions.json o objectius.json. Abans
d'escriure res valida l'Excel: si hi ha ERRORS no escriu cap fitxer i surt
amb codi 1; els AVISOS es mostren però no bloquegen.

Opcions:
    --fitxes DIR      carpeta amb els PDF (per defecte static/fitxes),
                       només per a 'intervencions'
    --indicadors FITXER  ruta a indicadors.json (per defecte
                          <--out>/indicadors.json), només per a 'objectius'
    --out DIR         carpeta de sortida (per defecte src/lib/data/Processed)
"""
import argparse
import json
import re
import sys
from pathlib import Path

import openpyxl

# Capçaleres de cada Excel (es llegeixen pel nom, no per la posició de la
# columna).
COLUMNS_INTERVENCIONS = {
    "eix_id": "EixId",
    "eix": "Eix",
    "linia": "Línia",
    "codi": "CODI_PROPI",
    "nom": "Nom de la intervenció",
    "datawrapper": "Link Datawrapper",
}
COLUMNS_OBJECTIUS = {
    "grup_id": "ObjectiuGeneralId",
    "edat": "EDAT",
    "codi": "INDICADOR_CODI",
    "grup": "Objectius generals",
    "objectiu": "Objectiu de salut",
    "indicador": "Indicador",
    "font": "Font",
}

# E<eix>-A<línia>-I<intervenció>, p. ex. E1-A1-I01 (el número final pot tenir
# més de 2 xifres, com E1-A1-I134).
CODI_PATTERN = re.compile(r"^E(\d+)-A(\d+)-I(\d+)$")

DATAWRAPPER_HOST = "https://datawrapper.dwcdn.net/"
IFRAME_SRC = re.compile(r'\bsrc="([^"]+)"')
IFRAME_HEIGHT = re.compile(r'\bheight="(\d+)"')

# Nom oficial de cada grup, tal com ja estan escrits els botons a
# EixosOverview.svelte -- si l'Excel en porta un altre, és un error, no un
# avís, perquè deixaria el botó i el contingut desincronitzats.
OBJECTIUS_GENERALS = {
    1: "Esperança de vida",
    2: "Mortalitat evitable",
    3: "Factors protectors i de risc",
    4: "Morbiditat",
}

PENDENT = "PENDENT OMPLIR"


class Report:
    """Recull errors (bloquegen) i avisos (informatius) i els imprimeix."""

    def __init__(self):
        self.errors = []
        self.warnings = []

    def error(self, message):
        self.errors.append(message)

    def warning(self, message):
        self.warnings.append(message)

    def print(self):
        for title, items in (("ERRORS BLOQUEJANTS", self.errors), ("AVISOS", self.warnings)):
            if items:
                print(f"\n{title} ({len(items)}):")
                for item in items:
                    print(f"  - {item}")


def sentence_case(name):
    """L'Excel escriu els eixos en MAJÚSCULES; a la web van en frase normal.
    Només es converteix si tot el text és en majúscules, així un nom ja
    escrit a mà (amb majúscules intencionades) no es toca."""
    name = name.strip()
    if name.isupper():
        name = name.lower()
    return name[:1].upper() + name[1:]


def parse_datawrapper(cell):
    """Accepta l'<iframe> complet enganxat de Datawrapper o només la URL.
    Retorna {"src", "height"} o None si no s'hi troba cap URL."""
    text = str(cell).strip()
    if text.lower().startswith("http"):
        return {"src": text, "height": None}
    src = IFRAME_SRC.search(text)
    if not src:
        return None
    height = IFRAME_HEIGHT.search(text)
    return {"src": src.group(1), "height": int(height.group(1)) if height else None}


def read_rows(excel_path, columns, report):
    """Llegeix totes les files no buides de la primera pestanya, com una
    llista de diccionaris amb les claus de `columns` (no els noms de
    columna de l'Excel)."""
    workbook = openpyxl.load_workbook(excel_path, data_only=True)
    sheet = workbook.worksheets[0]
    headers = [cell.value for cell in sheet[1]]

    missing = [name for name in columns.values() if name not in headers]
    if missing:
        report.error(f"Falten columnes a l'Excel: {', '.join(missing)}")
        return []

    index = {name: headers.index(name) for name in columns.values()}
    rows = []
    for number, values in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
        if not any(values):
            continue
        rows.append(
            {"row": number, **{key: values[index[name]] for key, name in columns.items()}}
        )
    return rows


# ---------------------------------------------------------------------------
# intervencions
# ---------------------------------------------------------------------------


def build_intervencions(rows, fitxes, report):
    eixos = {}  # EixId -> eix amb les seves línies i intervencions
    seen_codis = {}
    sense_codi = 0
    nous_per_linia = {}  # linia_id -> quantes intervencions sense codi

    # Una intervenció sense codi (encara no n'ha rebut cap) pertany a la línia
    # de les que sí en tenen, dins del mateix eix i amb el mateix nom de línia.
    linia_ids = {}
    for r in rows:
        if r["eix_id"] is None or not r["codi"] or not r["linia"]:
            continue
        m = CODI_PATTERN.match(str(r["codi"]).strip())
        if m:
            linia_ids.setdefault((r["eix_id"], r["linia"].strip()), f"E{m.group(1)}-A{m.group(2)}")

    for r in rows:
        where = f"fila {r['row']}"

        # Files sense EixId (p. ex. IMPLEMENTACIÓ) no formen part de l'estructura.
        if r["eix_id"] is None:
            continue

        if not isinstance(r["eix_id"], int) or r["eix_id"] < 1:
            report.error(f"{where}: EixId '{r['eix_id']}' no és un número enter positiu")
            continue

        codi = str(r["codi"]).strip() if r["codi"] else None
        label = codi or str(r["nom"])[:40]

        if not r["linia"] or not r["nom"] or not r["eix"]:
            report.error(f"{where}: {label} té l'eix, la línia o el nom buit")
            continue

        if codi:
            match = CODI_PATTERN.match(codi)
            if not match:
                report.error(f"{where}: el codi '{codi}' no segueix el patró E#-A#-I#")
                continue
            if int(match.group(1)) != r["eix_id"]:
                report.error(f"{where}: el codi {codi} és de l'eix {match.group(1)} però l'EixId és {r['eix_id']}")
                continue
            if codi in seen_codis:
                report.error(f"{where}: el codi {codi} ja s'ha fet servir a la fila {seen_codis[codi]}")
                continue
            seen_codis[codi] = r["row"]
            linia_id = f"E{match.group(1)}-A{match.group(2)}"
        else:
            # Intervenció nova, encara sense codi: es mostra igualment.
            linia_id = linia_ids.get((r["eix_id"], r["linia"].strip()))
            if linia_id is None:
                report.error(f"{where}: '{label}' no té codi i la seva línia no té cap intervenció amb codi")
                continue
            sense_codi += 1

        eix_name = sentence_case(r["eix"])
        eix = eixos.setdefault(r["eix_id"], {"id": r["eix_id"], "label": eix_name, "linies": {}})
        if eix["label"] != eix_name:
            report.error(f"{where}: l'EixId {r['eix_id']} té dos noms diferents: '{eix['label']}' i '{eix_name}'")

        linia = eix["linies"].setdefault(linia_id, {"id": linia_id, "label": r["linia"].strip(), "intervencions": []})
        if linia["label"] != r["linia"].strip():
            report.error(f"{where}: la línia {linia_id} té dos noms diferents: '{linia['label']}' i '{r['linia'].strip()}'")

        datawrapper = None
        if r["datawrapper"]:
            datawrapper = parse_datawrapper(r["datawrapper"])
            if datawrapper is None:
                report.error(f"{where}: no s'ha trobat cap URL a la cel·la de Datawrapper de {label}")
            elif not datawrapper["src"].startswith(DATAWRAPPER_HOST):
                report.warning(f"{where}: la URL de {label} no és de {DATAWRAPPER_HOST}")

        nom = str(r["nom"]).strip()
        if "PENDENT" in nom.upper():
            report.warning(f"{where}: {label} té una nota interna al nom ('{nom[-40:]}')")

        # `id` és el que fa servir la web per distingir intervencions: el codi
        # quan n'hi ha i, si no, un identificador provisional dins la línia.
        if codi:
            interv_id = codi
        else:
            nous_per_linia[linia_id] = nous_per_linia.get(linia_id, 0) + 1
            interv_id = f"{linia_id}-nou-{nous_per_linia[linia_id]}"

        linia["intervencions"].append(
            {
                "id": interv_id,
                "codi": codi,
                "nom": nom,
                "datawrapper": datawrapper,
                "fitxa": bool(codi) and f"{codi}.pdf" in fitxes,
            }
        )

    if sense_codi:
        report.warning(
            f"{sense_codi} intervencions sense CODI_PROPI (pendents de rebre'l): "
            "es mostren sense fitxa ni gràfic."
        )

    # Una línia (nom) no pot tenir dos codis A# ni al revés (dins d'un eix).
    for eix in eixos.values():
        names = {}
        for linia in eix["linies"].values():
            names.setdefault(linia["label"], []).append(linia["id"])
        for label, ids in names.items():
            if len(ids) > 1:
                report.error(f"eix {eix['id']}: la línia '{label}' surt amb dos codis: {', '.join(ids)}")

    return [
        {**eix, "linies": list(eix["linies"].values())}
        for _, eix in sorted(eixos.items())
    ]


def list_fitxes(folder, report):
    if not folder.is_dir():
        report.error(
            f"No es troba la carpeta de fitxes '{folder}'. Executa l'script des de "
            "l'arrel del projecte o indica-la amb --fitxes."
        )
        return set()
    return {p.name for p in folder.iterdir() if p.suffix.lower() == ".pdf"}


def run_intervencions(args, report):
    fitxes = list_fitxes(args.fitxes, report)
    rows = read_rows(args.excel, COLUMNS_INTERVENCIONS, report)
    eixos = build_intervencions(rows, fitxes, report)

    codis = {i["codi"] for e in eixos for l in e["linies"] for i in l["intervencions"] if i["codi"]}
    for pdf in sorted(fitxes):
        if pdf[:-4] not in codis:
            report.warning(f"El PDF '{pdf}' no correspon a cap intervenció (comprova el nom, també majúscules)")

    interventions = [i for e in eixos for l in e["linies"] for i in l["intervencions"]]
    print(f"Eixos: {len(eixos)} | Línies: {sum(len(e['linies']) for e in eixos)} | Intervencions: {len(interventions)}")
    print(f"Amb fitxa PDF: {sum(i['fitxa'] for i in interventions)} | Amb gràfic Datawrapper: {sum(bool(i['datawrapper']) for i in interventions)}")

    return eixos, "intervencions.json"


# ---------------------------------------------------------------------------
# objectius
# ---------------------------------------------------------------------------


def load_indicadors_index(path, report):
    """(codi, edat) -> id de indicadors.json, per enllaçar cada objectiu amb
    el seu dataset real sense endevinar sufixos."""
    if not path.is_file():
        report.error(
            f"No es troba '{path}'. Genera primer indicadors.json, o indica la "
            "ruta amb --indicadors."
        )
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    return {(item["codi"], item["edat"]): item["id"] for item in data}


def dedupe_labels(objectius):
    """Dos objectius amb el mateix text dins el mateix grup reben sufix
    -1/-2 (mai es fusionen), en l'ordre en què surten a l'Excel."""
    counts = {}
    for o in objectius:
        counts[o["label"]] = counts.get(o["label"], 0) + 1
    seen = {}
    for o in objectius:
        label = o["label"]
        if counts[label] > 1:
            seen[label] = seen.get(label, 0) + 1
            o["label"] = f"{label} ({seen[label]})"


def build_objectius(rows, indicadors_index, report):
    grups = {}  # ObjectiuGeneralId -> grup amb els seus objectius

    for r in rows:
        where = f"fila {r['row']}"

        if not isinstance(r["grup_id"], int) or r["grup_id"] not in OBJECTIUS_GENERALS:
            report.error(f"{where}: ObjectiuGeneralId '{r['grup_id']}' ha de ser 1, 2, 3 o 4")
            continue

        grup_nom = str(r["grup"]).strip() if r["grup"] else None
        if grup_nom != OBJECTIUS_GENERALS[r["grup_id"]]:
            report.error(
                f"{where}: el grup {r['grup_id']} hauria de dir "
                f"'{OBJECTIUS_GENERALS[r['grup_id']]}' i diu '{grup_nom}'"
            )
            continue

        objectiu = str(r["objectiu"]).strip() if r["objectiu"] else None
        if not objectiu:
            report.error(f"{where}: sense text a 'Objectiu de salut'")
            continue

        codi = str(r["codi"]).strip() if r["codi"] else None
        dataset_id = None
        if codi and codi.upper() != PENDENT:
            edat = str(r["edat"]).strip() if r["edat"] else None
            dataset_id = indicadors_index.get((codi, edat))
            if dataset_id is None:
                report.error(
                    f"{where}: el codi '{codi}' (edat: {edat}) no es troba a "
                    "indicadors.json"
                )
                continue

        grup = grups.setdefault(r["grup_id"], {"id": r["grup_id"], "label": grup_nom, "objectius": []})
        grup["objectius"].append(
            {
                "label": objectiu,
                "indicador": str(r["indicador"]).strip() if r["indicador"] else None,
                "font": str(r["font"]).strip() if r["font"] else "Pendent",
                "datasetId": dataset_id,
            }
        )

    for grup in grups.values():
        dedupe_labels(grup["objectius"])

    return [grups[i] for i in sorted(grups)]


def run_objectius(args, report):
    indicadors_path = args.indicadors or (args.out / "indicadors.json")
    indicadors_index = load_indicadors_index(indicadors_path, report)
    rows = read_rows(args.excel, COLUMNS_OBJECTIUS, report)
    grups = build_objectius(rows, indicadors_index, report)

    objectius = [o for g in grups for o in g["objectius"]]
    amb_dataset = sum(1 for o in objectius if o["datasetId"])
    amb_font_pendent = sum(1 for o in objectius if o["font"] == "Pendent")
    print(f"Grups: {len(grups)} | Objectius: {len(objectius)}")
    print(f"Amb dataset (visor de dades): {amb_dataset} | En procés d'elaboració: {len(objectius) - amb_dataset}")
    print(f"Amb Font pendent: {amb_font_pendent}")

    return grups, "objectius.json"


# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("target", choices=["intervencions", "objectius"])
    parser.add_argument("excel", type=Path)
    parser.add_argument("--fitxes", type=Path, default=Path("static/fitxes"))
    parser.add_argument("--indicadors", type=Path, default=None)
    parser.add_argument("--out", type=Path, default=Path("src/lib/data/Processed"))
    args = parser.parse_args()

    report = Report()
    if args.target == "intervencions":
        data, filename = run_intervencions(args, report)
    else:
        data, filename = run_objectius(args, report)

    report.print()
    if report.errors:
        print("\nNo s'ha generat cap fitxer: corregeix els errors a l'Excel i torna-ho a provar.")
        sys.exit(1)

    output = args.out / filename
    output.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\nGenerat: {output}")


if __name__ == "__main__":
    main()
