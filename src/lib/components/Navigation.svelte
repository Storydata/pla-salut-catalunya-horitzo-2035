<script>
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import Icon from "$lib/icons/Icon.svelte";
  import { fade, fly, slide } from "svelte/transition";

  // Cada secció és una ruta pròpia. "la_poblacio" és només l'agrupador del
  // desplegable i no té ruta.
  $: navItems = [
    { href: `${base}/`, label: "INICI" },
    {
      href: `${base}/orientacio/`,
      label: "ORIENTACIÓ\nDEL PLA DE SALUT",
    },
    {
      id: "la_poblacio",
      label: "LA POBLACIÓ DE CATALUNYA\nI LA SEVA SALUT",
      hasDropdown: true,
      dropdownItems: [
        {
          href: `${base}/estructura-poblacio/`,
          label: "Estructura de la població",
        },
        { href: `${base}/estat-salut/`, label: "La salut de la població" },
      ],
    },
    {
      href: `${base}/pla-salut-catalunya-horitzo-2035/`,
      label: "OBJECTIUS, METES\nI INDICADORS",
    },
    { href: `${base}/viure-mes-i-millor/`, label: "VIURE MÉS\nI MILLOR" },
    {
      href: `${base}/avaluacio-pla-salut/`,
      label: "AVALUACIÓ DEL PLA\nDE SALUT 2021-2025",
    },
  ];

  let mobileMenuOpen = false;
  let openDropdown = null;

  function toggleDropdown(id) {
    openDropdown = openDropdown === id ? null : id;
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    if (!mobileMenuOpen) {
      openDropdown = null;
    }
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
    openDropdown = null;
  }
</script>

<svelte:window
  on:keydown={(event) => event.key === "Escape" && closeMobileMenu()}
/>

<div class="relative z-50">
  <nav
    class="relative z-50 bg-white/95 shadow-[0px_3px_3px_0px_rgba(0,0,0,0.15)] backdrop-blur-md"
  >
    <div
      class="mx-auto flex h-[44px] items-center px-[var(--page-margin,1rem)]"
    >
      <div class="hidden w-full items-center justify-between md:flex">
        {#each navItems as item}
          <div class="relative flex items-center">
            {#if item.hasDropdown}
              <button
                type="button"
                class="flex items-center gap-1.5 text-[11px] leading-[14px] text-[#8b898e] transition-all hover:font-bold hover:text-[#2e3a59] {openDropdown ===
                item.id
                  ? 'font-bold'
                  : 'font-normal'}"
                aria-expanded={openDropdown === item.id}
                aria-haspopup="true"
                on:click={() => toggleDropdown(item.id)}
              >
                <span class="max-w-[200px] whitespace-pre-wrap text-center"
                  >{item.label}</span
                >
                <span
                  class="shrink-0 transition-transform duration-200"
                  class:rotate-180={openDropdown === item.id}
                >
                  <Icon
                    name="chevron-down"
                    class="h-4 w-4 text-[#b3b3b3]"
                    strokeWidth={1.5}
                  />
                </span>
              </button>

              {#if openDropdown === item.id}
                <!-- Penjat "en bandera" del seu propi text: ancorat a
                     l'esquerra d'aquesta pestanya concreta, no a un panell
                     compartit fora del nav. -->
                <div
                  class="absolute left-0 top-full z-40 w-max min-w-[220px] bg-white py-3 shadow-lg"
                  in:fly={{ y: -10, duration: 200 }}
                  out:fade={{ duration: 150 }}
                >
                  <div class="flex flex-col gap-1">
                    {#each item.dropdownItems as dropdownItem}
                      {#if dropdownItem.disabled}
                        <p class="px-4 py-1.5 text-[12px] text-[#c4c2c6]">
                          {dropdownItem.label}
                        </p>
                      {:else}
                        <a
                          href={dropdownItem.href}
                          class="block w-full rounded-[3px] px-4 py-1.5 text-left text-[12px] text-[#8b898e] transition-all hover:bg-gray-100 hover:font-bold hover:text-[#2e3a59]"
                          aria-current={$page.url.pathname === dropdownItem.href ? "page" : undefined}
                          on:click={closeMobileMenu}
                        >
                          {dropdownItem.label}
                        </a>
                      {/if}
                    {/each}
                  </div>
                </div>
              {/if}
            {:else}
              <a
                href={item.href}
                class="max-w-[200px] whitespace-pre-wrap text-center text-[11px] leading-[14px] text-[#8b898e] transition-all hover:font-bold hover:text-[#2e3a59]"
                aria-current={$page.url.pathname === item.href ? "page" : undefined}
                on:click={closeMobileMenu}
              >
                {item.label}
              </a>
            {/if}
          </div>
        {/each}
      </div>

      <button
        type="button"
        class="ml-auto p-2 text-gray-900 md:hidden"
        aria-label={mobileMenuOpen ? "Tanca el menú" : "Obre el menú"}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-menu"
        on:click={toggleMobileMenu}
      >
        {#if mobileMenuOpen}
          <Icon name="x" class="h-6 w-6" />
        {:else}
          <Icon name="menu" class="h-6 w-6" />
        {/if}
      </button>
    </div>
  </nav>

  {#if mobileMenuOpen}
    <div
      id="mobile-menu"
      class="absolute left-0 right-0 top-full z-40 max-h-[calc(100dvh-var(--site-header-h,143px))] overflow-y-auto border-b border-gray-200 bg-white shadow-sm md:hidden"
      in:fly={{ y: -20, duration: 200 }}
      out:fade={{ duration: 150 }}
    >
      <div class="flex flex-col py-2">
        {#each navItems as item}
          <div>
            {#if item.hasDropdown}
              <button
                type="button"
                class="flex w-full items-center justify-between px-[var(--page-margin,1rem)] py-3 text-left text-[11px] text-[#8b898e] transition-all hover:bg-gray-100 hover:text-gray-700"
                aria-expanded={openDropdown === item.id}
                on:click={() => toggleDropdown(item.id)}
              >
                {item.label}
                <span
                  class="transition-transform duration-200"
                  class:rotate-180={openDropdown === item.id}
                >
                  <Icon
                    name="chevron-down"
                    class="h-3 w-3 text-[#b3b3b3]"
                    strokeWidth={1.5}
                  />
                </span>
              </button>

              {#if openDropdown === item.id}
                <div transition:slide>
                  {#each item.dropdownItems as dropdownItem}
                    {#if dropdownItem.disabled}
                      <p
                        class="px-[calc(var(--page-margin,1rem)+1rem)] py-3 text-[11px] text-[#c4c2c6]"
                      >
                        {dropdownItem.label}
                      </p>
                    {:else}
                      <a
                        href={dropdownItem.href}
                        class="block w-full px-[calc(var(--page-margin,1rem)+1rem)] py-3 text-left text-[11px] text-[#8b898e] hover:bg-gray-50 hover:text-gray-700"
                        aria-current={$page.url.pathname === dropdownItem.href ? "page" : undefined}
                        on:click={closeMobileMenu}
                      >
                        {dropdownItem.label}
                      </a>
                    {/if}
                  {/each}
                </div>
              {/if}
            {:else}
              <a
                href={item.href}
                class="block w-full px-[var(--page-margin,1rem)] py-3 text-left text-[11px] text-[#8b898e] transition-all hover:bg-gray-100 hover:text-gray-700"
                aria-current={$page.url.pathname === item.href ? "page" : undefined}
                on:click={closeMobileMenu}
              >
                {item.label}
              </a>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
