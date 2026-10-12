<script>
  import { base } from "$app/paths";
</script>

<header>
  <!-- Franja 1: 45px, #333 -->
  <div class="top-strip">
    <div class="page-width top-row">
      <a
        class="gencat-link"
        href="https://web.gencat.cat/ca/inici"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Generalitat de Catalunya"
      >
        <img
          src={`${base}/logotip_generalitat/Logo-gencat-B.svg`}
          alt="Generalitat de Catalunya"
          class="gencat-logo"
        />
      </a>
    </div>
  </div>

  <!-- Franja 2: 65px, #ececec. El logo i el títol van en fila quan hi caben;
       si el títol necessita dues línies es queda centrat dins de la seva caixa
       i centrat en vertical a la franja. Per sota de md, el títol passa sota
       el logo, centrat. -->
  <div class="brand-strip">
    <div class="page-width brand-row">
      <a
        class="salut-link"
        href="https://salutweb.gencat.cat/ca/inici"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Generalitat de Catalunya. Departament de Salut"
      >
        <img
          src={`${base}/logotip_generalitat/Logo-Generalitat-Salut.svg`}
          alt="Generalitat de Catalunya. Departament de Salut"
          class="salut-logo"
        />
      </a>
      <p class="site-title">Pla de salut de Catalunya. Horitzó 2035</p>
    </div>
  </div>
</header>

<style>
  /* Les mides són les de la maqueta (franja 1: 45px, franja 2: 65px, logos,
     títol 24px) multiplicades per un únic factor: canviar --scale redimensiona
     tota la capçalera sense tocar cap altra xifra. Per sota de md (mòbil) és
     0.75 perquè la capçalera, que és fixada, ocupi menys pantalla; des de md,
     0.9. */
  header {
    --scale: 0.75;
  }

  /* Marge lateral compartit amb el menú (Navigation.svelte): el defineix el
     contenidor #site-header a _layout.svelte -- 1rem per sota de lg i el 10% de
     l'ample de la web a partir de lg --, així logos, títol i menú s'alineen
     sempre i es canvia en un sol lloc. */
  .page-width {
    padding-inline: var(--page-margin, 1rem);
  }

  .top-strip {
    height: calc(45px * var(--scale));
    background-color: #333333;
  }

  .top-row {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .gencat-link,
  .salut-link {
    display: flex;
    text-decoration: none;
  }

  .salut-link {
    flex-shrink: 0;
  }

  .gencat-logo {
    height: calc(22.7px * var(--scale));
    width: auto;
  }

  .brand-strip {
    background-color: #ececec;
  }

  .brand-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: calc(0.5rem * var(--scale));
    min-height: calc(65px * var(--scale));
    padding-block: calc(0.5rem * var(--scale));
  }

  .salut-logo {
    height: calc(31.6px * var(--scale));
    width: auto;
  }

  .site-title {
    align-self: stretch;
    margin: 0;
    font-family: "Open Sans", sans-serif;
    font-size: calc(24px * var(--scale));
    font-weight: 500;
    line-height: 1.3;
    color: #333333;
    text-align: center;
    text-wrap: balance;
  }

  @media (min-width: 768px) {
    header {
      --scale: 0.9;
    }

    .brand-row {
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: calc(1.5rem * var(--scale));
    }

    .site-title {
      align-self: auto;
    }
  }
</style>
