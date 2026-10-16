<script>
  import { base } from "$app/paths";

  const socials = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/gencat",
      viewBox: "0 0 320 512",
      d: "M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/gencat",
      viewBox: "0 0 448 512",
      d: "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/generalitat-de-catalunya",
      viewBox: "0 0 448 512",
      d: "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z",
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@gencat",
      viewBox: "0 0 448 512",
      d: "M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z",
    },
    {
      name: "X",
      href: "https://x.com/gencat",
      viewBox: "0 0 512 512",
      d: "M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z",
    },
    {
      name: "Telegram",
      href: "https://t.me/gencat",
      viewBox: "0 0 496 512",
      d: "M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z",
    },
    {
      name: "WhatsApp",
      href: "https://whatsapp.com/channel/gencat",
      viewBox: "0 0 448 512",
      d: "M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z",
    },
  ];

  const legalLinks = [
    {
      label: "Accessibilitat",
      href: "https://web.gencat.cat/ca/menu-ajuda/ajuda/accessibilitat/",
    },
    {
      label: "Avís legal",
      href: "https://web.gencat.cat/ca/menu-ajuda/ajuda/avis_legal/",
    },
    {
      label: "Política de galetes",
      href: "https://web.gencat.cat/ca/menu-ajuda/ajuda/politica-de-galetes/",
    },
    { label: "Mapa web", href: "https://web.gencat.cat/ca/mapa-web/" },
  ];
</script>

<footer class="gencat-footer mt-12 w-full md:mt-16">
  <div class="mx-auto w-full max-w-6xl px-6 pb-10 pt-[25px] md:pb-12 md:pt-[33px]">
    <h2 class="social-heading text-center">
      Segueix-nos a les xarxes socials de gencat
    </h2>

    <ul class="mt-6 flex flex-wrap items-center justify-center gap-3">
      {#each socials as social}
        <li>
          <a
            class="social-btn"
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            title={social.name}
          >
            <svg
              viewBox={social.viewBox}
              fill="currentColor"
              aria-hidden="true"
            >
              <path d={social.d} />
            </svg>
          </a>
        </li>
      {/each}
    </ul>

    <div
      class="mt-10 flex flex-col items-center gap-6 md:mt-12 md:flex-row md:items-end md:justify-between"
    >
      <a
        class="brand flex items-center gap-3"
        href="https://web.gencat.cat/ca/inici"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Generalitat de Catalunya"
      >
        <img
          src={`${base}/logotip_generalitat/idb_cat_blanc.svg`}
          alt="Generalitat de Catalunya"
          class="brand-mark"
        />
      </a>

      <ul
        class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:justify-end"
      >
        {#each legalLinks as link}
          <li>
            <a
              class="legal-link"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <p class="credit mt-4 text-center md:text-right">
      Visualització de dades:
      <a
        class="legal-link"
        href="https://www.storydata.es/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Storydata
      </a>
    </p>
  </div>
</footer>

<style>
  .gencat-footer {
    background-color: #2e2e2e;
    color: #ffffff;
    font-family: "Inter", sans-serif;
  }

  .social-heading {
    font-size: clamp(15px, 2.5vw, 19px);
    font-weight: 600;
    line-height: 1.3;
  }

  .social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border: 1px solid #ffffff;
    border-radius: 10px;
    color: #ffffff;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
  }

  .social-btn:hover,
  .social-btn:focus-visible {
    background-color: #ffffff;
    color: #2e2e2e;
  }

  .social-btn svg {
    width: 17px;
    height: 17px;
  }

  .brand {
    color: #ffffff;
    text-decoration: none;
  }

  .brand-mark {
    height: 24px;
    width: auto;
    flex-shrink: 0;
  }

  @media (min-width: 768px) {
    .brand-mark {
      height: 32px;
    }
  }

  .legal-link {
    color: var(--link-color, #ffffff);
    font-size: 12px;
    font-weight: var(--link-weight, 500);
    text-decoration: underline;
    text-underline-offset: 4px;
    transition: opacity 0.2s ease;
  }

  /* Crèdit sota els enllaços legals: mateix estil, en gris i en regular. */
  .credit {
    --link-color: #b9b8bb;
    --link-weight: 400;
    color: var(--link-color);
    font-size: 12px;
    font-weight: var(--link-weight);
  }

  .legal-link:hover,
  .legal-link:focus-visible {
    opacity: 0.75;
  }
</style>
