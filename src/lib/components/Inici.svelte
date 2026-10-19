<script>
  import bgImage from "$lib/assets/Ilustracio-NOVA-1-Intro.jpg";
</script>

<div
  class="relative bg-white w-full flex flex-col justify-center lg:min-h-screen"
>
  <div class="hero w-full">
    <img
      src={bgImage}
      alt="Il·lustració d’inici"
      class="w-full h-auto block max-h-[85vh]"
    />
  </div>
  <!-- El títol se separa del menú amb la mateixa distància que la resta de
       seccions (a lg), mesurada des de dalt de la secció i no des de la imatge,
       que queda centrada verticalment. -->
  <div
    class="absolute inset-x-0 top-[5vw] lg:top-[var(--section-top-gap)] text-center px-4"
  >
    <h1
      class="font-titol text-[clamp(1.5rem,6vw,4.5rem)] leading-[1.15] font-normal tracking-tight text-[#2E3A59]"
    >
      <!--  Pla de salut de Catalunya <br />Horitzó 2035 -->
    </h1>
  </div>
  <div class="px-4 w-full flex items-center justify-center mx-auto py-0">
    <div class="container mx-auto text-center max-w-4xl">
      <p
        class="font-['Inter',sans-serif] text-[15px] leading-[1.65] md:text-lg md:leading-8 font-normal text-center text-[#2E3A59] px-0 py-[25px] sm:px-[35px]"
      >
        El Pla de salut de Catalunya és l’instrument i marc de referència per a
        totes les actuacions públiques en matèria de salut dins l’àmbit de la
        Generalitat. El seu objectiu és millorar la salut i la qualitat de vida
        de la població i actuar com a brúixola del sistema de salut. El Pla de
        salut de Catalunya. Horitzó 2035 analitza els principals reptes i
        oportunitats de la societat actual per tal d’incidir-hi amb aquest mateix objectiu:
        millorar la qualitat de vida i la salut de la població de Catalunya.
      </p>
    </div>
  </div>
</div>
