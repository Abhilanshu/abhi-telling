const TEXT_BLOCKS = [
  {
    id: 'hero-landing',
    className: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center',
    scrollStart: (e, isMobile, isTablet) => 0,
    scrollEnd: (e, isMobile, isTablet) => 0,
    scrollStart2: (e, isMobile, isTablet) => 0,
    scrollEnd2: (e, isMobile, isTablet) => 100,
    content: `<div class="hero-text-block">
                <h2 class="hero-h2">
                  The power<br />
                  <span class="serif-italic">of</span> digital
                </h2>
                <h1>
                  <span class="char char1">s</span>
                  <span class="char char2">t</span>
                  <span class="char char3">o</span>
                  <span class="char char4">r</span>
                  <span class="char char5">y</span>
                  <span class="char char6">t</span>
                  <span class="char char7">e</span>
                  <span class="char char8">l</span>
                  <span class="char char9">l</span>
                  <span class="char char10">i</span>
                  <span class="char char11">n</span>
                  <span class="char char12">g</span>
                </h1>
              </div>`,
    isCase: false,
    link: ''
  },

  {
    id: 'crystal0',
    className: 'xs:left-0 lg:left-[20vw]',
    scrollStart: (e, isMobile, isTablet) => e(16) + 110 + 0 + 0,
    scrollEnd: (e, isMobile, isTablet) => e(16) + 230 + (isMobile ? -38 : 0) + (isTablet ? -42 : 0),
    scrollStart2: null,
    scrollEnd2: null,
    content: `<span class="flex xs:items-center lg:items-start gap-0 flex-col xs:relative lg:absolute h-full lg:-top-12 lg:left-80">
                <span class="xs:text-sans-26 lg:text-sans-50 whitespace-nowrap relative z-2">Coinbase & Warriors</span><br>
                <span class="text-sans-18 -mt-10 relative z-2">Brand activation</span>
                <span class="absolute xs:hidden lg:block w-full xs:blur-none lg:blur-[80px] h-151 bg-dark-400 left-0 top-0 rounded-[100%] -translate-y-1/4"></span>
              </span>`,
    isCase: true,
    link: '/cases/coinbase-warriors'
  },
  {
    id: 'crystal1',
    className: 'xs:right-0 lg:right-[20vw]',
    scrollStart: (e, isMobile, isTablet) => e(16) + 140 + (isMobile ? 6 : 0) + (isTablet ? 7 : 0),
    scrollEnd: (e, isMobile, isTablet) => e(16) + 260 + (isMobile ? -39 : 0) + (isTablet ? -41 : 0),
    scrollStart2: null,
    scrollEnd2: null,
    content: `<span class="flex xs:items-center lg:items-start gap-0 flex-col xs:relative lg:absolute h-full lg:-top-12 lg:right-80">
                <span class="xs:text-sans-26 lg:text-sans-50 whitespace-nowrap relative z-2">Salesforce</span><br>
                <span class="text-sans-18 -mt-10 relative z-2">Agentforce360 website</span>
                <span class="absolute xs:hidden lg:block w-full blur-[80px] h-151 bg-dark-400 left-0 top-0 rounded-[100%] -translate-y-1/4"></span>
              </span>`,
    isCase: true,
    link: '/cases/salesforce-agentforce-360'
  },
  {
    id: 'crystal2',
    className: 'xs:left-0 lg:left-[20vw]',
    scrollStart: (e, isMobile, isTablet) => e(16) + 180 + (isMobile ? 5 : 0) + (isTablet ? 5 : 0),
    scrollEnd: (e, isMobile, isTablet) => e(16) + 290 + (isMobile ? -47 : 0) + (isTablet ? -55 : 0),
    scrollStart2: null,
    scrollEnd2: null,
    content: `<span class="flex xs:items-center lg:items-start gap-0 flex-col xs:relative lg:absolute h-full lg:-top-12 lg:left-80">
                <span class="xs:text-sans-26 lg:text-sans-50 whitespace-nowrap relative z-2">Intel | ai.io</span><br>
                <span class="text-sans-18 -mt-10 relative z-2">Event booth experience</span>
                <span class="absolute xs:hidden lg:block w-full blur-[80px] h-151 bg-dark-400 left-0 top-0 rounded-[100%] -translate-y-1/4"></span>
              </span>`,
    isCase: true,
    link: '/cases/intel-ai-io'
  },
  {
    id: 'crystal3',
    className: 'xs:right-0 lg:right-[20vw]',
    scrollStart: (e, isMobile, isTablet) => e(16) + 210 + (isMobile ? 2 : 0) + (isTablet ? 3 : 0),
    scrollEnd: (e, isMobile, isTablet) => e(16) + 310 + (isMobile ? -42 : 0) + (isTablet ? -45 : 0),
    scrollStart2: null,
    scrollEnd2: null,
    content: `<span class="flex xs:items-center lg:items-start gap-0 flex-col xs:relative lg:absolute h-full lg:-top-12 lg:right-80">
                <span class="xs:text-sans-26 lg:text-sans-50 whitespace-nowrap relative z-2">Vogue Business | Archival </span><br>
                <span class="text-sans-18 -mt-10 relative z-2">Editorial  website</span>
                <span class="absolute xs:hidden lg:block w-full blur-[80px] h-151 bg-dark-400 left-0 top-0 rounded-[100%] -translate-y-1/4"></span>
              </span>`,
    isCase: true,
    link: '/cases/vogue-business-archival'
  },
  {
    id: 'crystal4',
    className: 'xs:left-0 lg:left-[20vw]',
    scrollStart: (e, isMobile, isTablet) => e(16) + 230 + (isMobile ? 5 : 0) + (isTablet ? 4 : 0),
    scrollEnd: (e, isMobile, isTablet) => e(16) + 335 + (isMobile ? -40 : 0) + (isTablet ? -45 : 0),
    scrollStart2: null,
    scrollEnd2: null,
    content: `<span class="flex xs:items-center lg:items-start gap-0 flex-col xs:relative lg:absolute h-full lg:-top-12 lg:left-80">
                <span class="xs:text-sans-26 lg:text-sans-50 whitespace-nowrap relative z-2">Noomo Labs</span><br>
                <span class="text-sans-18 -mt-10 relative z-2">3D website</span>
                <span class="absolute xs:hidden lg:block w-full blur-[80px] h-151 bg-dark-400 left-0 top-0 rounded-[100%] -translate-y-1/4"></span>
              </span>`,
    isCase: true,
    link: '/cases/noomo-labs'
  },
  {
    id: 'crystal5',
    className: 'xs:right-0 lg:right-[20vw]',
    scrollStart: (e, isMobile, isTablet) => e(16) + 270 + (isMobile ? -7 : 0) + (isTablet ? -4 : 0),
    scrollEnd: (e, isMobile, isTablet) => e(16) + 370 + (isMobile ? -46 : 0) + (isTablet ? -55 : 0),
    scrollStart2: null,
    scrollEnd2: null,
    content: `<span class="flex xs:items-center lg:items-start gap-0 flex-col xs:relative lg:absolute h-full lg:-top-12 lg:right-80">
                <span class="xs:text-sans-26 lg:text-sans-50 whitespace-nowrap relative z-2">Noomo Valentime </span><br>
                <span class="text-sans-18 -mt-10 relative z-2">3D storytelling</span>
                <span class="absolute xs:hidden lg:block w-full blur-[80px] h-151 bg-dark-400 left-0 top-0 rounded-[100%] -translate-y-1/4"></span>
              </span>`,
    isCase: true,
    link: '/cases/noomo-valentime'
  },
  {
    id: 'crystal6',
    className: 'xs:left-0 lg:left-[20vw]',
    scrollStart: (e, isMobile, isTablet) => e(16) + 300 + (isMobile ? -7 : 0) + (isTablet ? -7 : 0),
    scrollEnd: (e, isMobile, isTablet) => e(16) + 390 + (isMobile ? -32 : 0) + (isTablet ? -35 : 0),
    scrollStart2: null,
    scrollEnd2: null,
    content: `<span class="flex xs:items-center lg:items-start gap-0 flex-col xs:relative lg:absolute h-full lg:-top-12 lg:left-80">
                <span class="xs:text-sans-26 lg:text-sans-50 whitespace-nowrap relative z-2">AMD</span><br>
                <span class="text-sans-18 -mt-10 whitespace-nowrap relative z-2">Digital event experience</span>
                <span class="absolute xs:hidden lg:block w-full blur-[80px] h-151 bg-dark-400 left-0 top-0 rounded-[100%] -translate-y-1/4"></span>
              </span>`,
    isCase: true,
    link: '/cases/amd-ai-factory'
  },
  {
    id: 'block_7',
    className: 'top-1/2 left-1/2 -translate-x-1/2 xs:-translate-y-1/1 lg:-translate-y-2/3',
    scrollStart: (e, isMobile, isTablet) => e(0) - 50 / (isMobile ? 2 : 1) + (isMobile ? 30 : 0),
    scrollEnd: (e, isMobile, isTablet) => e(0) + 100 / (isMobile ? 2 : 1),
    scrollStart2: (e, isMobile, isTablet) => e(1),
    scrollEnd2: (e, isMobile, isTablet) => e(1) + 150 / (isMobile ? 2 : 1),
    content: `<p class='lg:text-sans-50 xs:text-sans-30 text-center'>
             <span class="text-icon-bird ic mb-20 inline-block"></span>
             <span class="text-line from-scale half ic lg:!w-300 xs:!w-200 xs:-translate-y-5 lg:-translate-y-0 xs:translate-x-1/2 lg:translate-x-1/3"></span>
             In a world that’s<br>
             <span class="text-line from-scale ic translate-x-[10%] xs:!hidden lg:!block -translate-y-[200%] xs:!w-350 lg:!w-500"></span>
             <span class="relative z-2">constantly <i class="lg:text-serif-50 xs:text-serif-30 xs:-translate-y-1 lg:translate-y-0">shifting,</i></span><br>
             <span class="text-line from-scale half ic xs:translate-y-8 lg:translate-y-0 xs:translate-x-[-10%] lg:translate-x-[0%] !w-412"></span>
           </p>`,
    isCase: false,
    link: ''
  },
  {
    id: 'block_8',
    className: 'lg:top-[40vh] xs:top-[30vh] right-[10vw]',
    scrollStart: (e, isMobile, isTablet) => e(1) + 100 / (isMobile ? 2 : 1),
    scrollEnd: (e, isMobile, isTablet) => e(1) + 220 / (isMobile ? 2 : 1),
    scrollStart2: (e, isMobile, isTablet) => e(2) + 70 / (isMobile ? 2 : 1),
    scrollEnd2: (e, isMobile, isTablet) => e(2) + 200 / (isMobile ? 2 : 1),
    content: `<p class='lg:text-sans-50 xs:text-sans-30 text-right'>
             <span class="xs:hidden lg:inline-block xs:mr-0 lg:mr-178">what</span><br>
             <span class="text-line from-scale xs:!hidden lg:!block half ic !w-230 xs:translate-x-[160%] lg:translate-x-1/1"></span>
             <span class="inline-block xs:mr-63 lg:mr-110 relative z-2"><span class="xs:inline lg:hidden">what</span>&nbsp;guides</span><br>
             <span class="text-line from-scale xs:!hidden lg:!block ic half !w-300 xs:translate-x-[110%] lg:translate-x-4/5"></span>
             <span class="inline-block xs:mr-25 lg:mr-0 relative z-2">us through</span><br>
             <span class="text-line from-scale xs:!hidden lg:!block ic half !w-400 translate-x-4/6"></span>
             <span class="inline-block xs:mr-0 lg:mr-115 relative z-2"><i class="lg:text-serif-50 xs:text-serif-30 xs:-translate-x-3 lg:translate-x-0">change,</i><span class="xs:inline lg:hidden"></span></span><br>
             <span class="text-line from-scale xs:!hidden lg:!block ic half !w-300 translate-x-3/4 xs:translate-x-[85%] lg:-translate-y-[200%]"></span>
             <span class="inline-block xs:mr-20 lg:mr-166">reinvention,<span class="xs:inline lg:hidden"></span></span><br>
             <span class="text-line from-scale xs:!hidden lg:!block ic half !w-450 xs:translate-x-[50%] lg:translate-x-1/10"></span>
             <span class="inline-block xs:mr-20 lg:mr-223">and the <i class="lg:text-serif-50 xs:text-serif-30 xs:-translate-x-3 lg:translate-x-0">unknown</i>–<span class="xs:inline lg:hidden"></span></span><br>
             <span class="text-line from-scale ic half xs:-translate-y-[0%] lg:-translate-y-[200%] xs:!w-300 lg:!w-600 xs:translate-x-[5%] lg:-translate-x-1/3"></span>
           </p>`,
    isCase: false,
    link: ''
  },
  {
    id: 'block_9',
    className: 'top-1/2 left-1/2 -translate-x-1/2 xs:-translate-y-[120%] lg:-translate-y-2/3',
    scrollStart: (e, isMobile, isTablet) => e(3) + 250 / (isMobile ? 2 : 1),
    scrollEnd: (e, isMobile, isTablet) => e(3) + 400 / (isMobile ? 2 : 1),
    scrollStart2: (e, isMobile, isTablet) => e(5),
    scrollEnd2: (e, isMobile, isTablet) => e(5) + 100 / (isMobile ? 2 : 1),
    content: `<p class='lg:text-sans-50 xs:text-sans-30 text-center'>
             <span class="text-icon-bird-2 rotate-180 ic mb-20 inline-block"></span>
             <span class="text-line from-scale half ic xs:!w-250 lg:!w-320 xs:translate-x-[-10%] lg:translate-x-[15%]"></span>
             <i class="lg:text-serif-50 xs:text-serif-30 xs:-translate-x-2 xs:-translate-y-1 lg:translate-x-0 lg:translate-y-0">Stories</i> emerge<span class="xs:block lg:hiddn"></span> through<br>
             <span class="text-line from-scale ic half xs:translate-x-[10%] lg:translate-x-[10%] translate-y-4 xs:!w-200 lg!w-400"></span>
           </p>`,
    isCase: false,
    link: ''
  },
  {
    id: 'block_10',
    className: 'top-1/2 left-1/2 -translate-x-1/2 xs:-translate-y-1/1 lg:-translate-y-1/2',
    scrollStart: (e, isMobile, isTablet) => e(2) + 150 / (isMobile ? 2 : 1),
    scrollEnd: (e, isMobile, isTablet) => e(2) + 300 / (isMobile ? 2 : 1),
    scrollStart2: (e, isMobile, isTablet) => e(3) + 150 / (isMobile ? 2 : 1),
    scrollEnd2: (e, isMobile, isTablet) => e(3) + 300 / (isMobile ? 2 : 1),
    content: `<p class="xs:text-serif-80 lg:text-serif-200 text-center whitespace-nowrap">
            <i class="lg:text-serif-50 xs:block lg:inline xs:text-serif-30 text-brand-black lg:-translate-y-[200%] xs:translate-y-[140%] lg:-translate-x-[40%]">is</i>
            <span class="gradient-text">narrative.</span><br>
           </p>`,
    isCase: false,
    link: ''
  },
  {
    id: 'block_11',
    className: 'top-1/2 left-1/2 -translate-x-1/2 xs:-translate-y-1/1 lg:-translate-y-1/2',
    scrollStart: (e, isMobile, isTablet) => e(5) + 50 / (isMobile ? 2 : 1),
    scrollEnd: (e, isMobile, isTablet) => e(5) + 120 / (isMobile ? 2 : 1),
    scrollStart2: (e, isMobile, isTablet) => e(5) + 200 / (isMobile ? 2 : 1),
    scrollEnd2: (e, isMobile, isTablet) => e(5) + 270 / (isMobile ? 2 : 1),
    content: `<p class="xs:text-serif-100 whitespace-nowrap lg:text-serif-200 text-center gradient-text gradient-text-big">
            Light
           </p>`,
    isCase: false,
    link: ''
  },
  {
    id: 'block_12',
    className: 'top-1/2 left-1/2 -translate-x-1/2 xs:-translate-y-1/1 lg:-translate-y-1/2',
    scrollStart: (e, isMobile, isTablet) => e(6) - 170 / (isMobile ? 2 : 1),
    scrollEnd: (e, isMobile, isTablet) => e(6) - 100 / (isMobile ? 2 : 1),
    scrollStart2: (e, isMobile, isTablet) => e(6) - 20 / (isMobile ? 2 : 1),
    scrollEnd2: (e, isMobile, isTablet) => e(6) + 30 / (isMobile ? 2 : 1),
    content: `<p class="xs:text-serif-100 whitespace-nowrap lg:text-serif-200 text-center gradient-text gradient-text-big">
            Spirit
           </p>`,
    isCase: false,
    link: ''
  },
  {
    id: 'block_13',
    className: 'top-1/2 left-1/2 -translate-x-1/2 xs:-translate-y-1/1 lg:-translate-y-1/2',
    scrollStart: (e, isMobile, isTablet) => e(6) + 80 / (isMobile ? 2 : 1),
    scrollEnd: (e, isMobile, isTablet) => e(6) + 150 / (isMobile ? 2 : 1),
    scrollStart2: (e, isMobile, isTablet) => e(6) + 220 / (isMobile ? 2 : 1),
    scrollEnd2: (e, isMobile, isTablet) => e(6) + 290 / (isMobile ? 2 : 1),
    content: `<p class="xs:text-serif-100 whitespace-nowrap lg:text-serif-200 text-center gradient-text gradient-text-big">
            Sound
           </p>`,
    isCase: false,
    link: ''
  },
  {
    id: 'block_14',
    className: 'xs:top-1/4 lg:top-1/12 left-1/2 -translate-x-1/2',
    scrollStart: (e, isMobile, isTablet) => e(10) - 100,
    scrollEnd: (e, isMobile, isTablet) => e(10) - 30,
    scrollStart2: (e, isMobile, isTablet) => e(10) + 50,
    scrollEnd2: (e, isMobile, isTablet) => e(10) + 170,
    content: `<p class='xs:text-sans-38 lg:text-sans-50 text-center'>
             <span class="text-icon-flower-white ic mb-26 !mx-auto !block"></span>
             The best <i class="xs:text-serif-38 lg:text-serif-50">stories</i><br>
             <span class="text-line xs:!hidden lg:!block from-scale -translate-y-4 dark ic !w-280"></span>
             <span class="relative z-2">don’t just</span><br>
             <span class="text-line xs:!hidden lg:!block from-scale dark ic !w-260 "></span>
             <span class="relative z-2">speak to</span>&nbsp;<i class="text-serif-38 xs:inline lg:hidden">us</i><br>
             <span class="text-line xs:!hidden lg:!block from-scale dark ic !w-300 -translate-x-[7%]"></span>
             <span class="xs:text-serif-38 xs:hidden lg:block lg:text-serif-50 relative z-2">us.</span>
             <span class="text-line xs:!hidden lg:!block from-scale dark ic -translate-y-4 !w-300 -translate-x-[7%]"></span>
             <span class="relative z-2 mt-5 inline-block"><i class="xs:text-serif-38 lg:text-serif-50">Th</i>ey</span><br>
             <span class="text-line xs:!hidden lg:!block from-scale dark -translate-y-4 ic !w-300 translate-x-[1%]"></span>
             <span class="relative z-2"> invite us <i class="xs:text-serif-38 lg:text-serif-50">inside.</i></span><br>
             <span class="text-line from-scale dark ic !w-300 lg:-translate-y-2 xs:translate-x-[2%] lg:translate-x-[7%]"></span>
           </p>`,
    isCase: false,
    link: ''
  },
  {
    id: 'block_15',
    className: 'xs:top-1/9 lg:top-1/6 left-1/2 xs:w-full lg:w-auto -translate-x-1/2',
    scrollStart: (e, isMobile, isTablet) => e(17) - 180 + (isMobile ? -100 : 0),
    scrollEnd: (e, isMobile, isTablet) => e(17) - 90 + (isMobile ? -100 : 0),
    scrollStart2: (e, isMobile, isTablet) => e(17) - 10 + (isMobile ? -20 : 0),
    scrollEnd2: (e, isMobile, isTablet) => e(17) + 60 + (isMobile ? -20 : 0),
    content: `<p class='xs:text-sans-18 lg:text-sans-26 text-center'>
             Storytelling is much <br>more than words.
           </p>`,
    isCase: false,
    link: ''
  },
  {
    id: 'block_16',
    className: 'xs:bottom-1/8 lg:bottom-1/6 left-1/2 -translate-x-1/2',
    scrollStart: (e, isMobile, isTablet) => e(17) - 160 + (isMobile ? -100 : 0),
    scrollEnd: (e, isMobile, isTablet) => e(17) - 70 + (isMobile ? -100 : 0),
    scrollStart2: (e, isMobile, isTablet) => e(17) + 40 + (isMobile ? 20 : 0),
    scrollEnd2: (e, isMobile, isTablet) => e(17) + 120 + (isMobile ? 20 : 0),
    content: `<p class='xs:text-sans-38 lg:text-sans-66 text-center'>
             <span>It is how a spark</span><br>
             <span class="text-line lg:!block xs:!hidden from-scale dark ic !w-700 -translate-y-1 -translate-x-[8%]"></span>
             <span class="inline-block lg:-translate-y-2">becomes <i class="xs:text-sans-38 xs:not-italic lg:italic lg:text-serif-66">a fire.</i></span><br>
             <span class="text-line from-scale dark ic xs:!w-250 lg:!w-600 xs:-translate-y-4 lg:-translate-y-10 xs:translate-x-[10%] lg:-translate-x-[5%]"></span>
           </p>`,
    isCase: false,
    link: ''
  },
  {
    id: 'block_17',
    className: 'lg:bottom-1/10 xs:bottom-1/9 left-1/2 -translate-x-1/2',
    scrollStart: (e, isMobile, isTablet) => e(17) + 110 + (isMobile ? 20 : 0),
    scrollEnd: (e, isMobile, isTablet) => e(17) + 210 + (isMobile ? 20 : 0),
    scrollStart2: (e, isMobile, isTablet) => e(17) + 300,
    scrollEnd2: (e, isMobile, isTablet) => e(17) + 400,
    content: `<p class='xs:text-sans-38 lg:text-sans-66  text-center xs:w-[100vw] lg:w-auto xs:px-0 lg:px-0'>
             <span>Storytelling is what you</span><br>
             <span class="text-line xs:!hidden lg:!block -translate-y-6 from-scale dark ic !w-700 -translate-x-[8%]"></span>
             <span>see, feel, hear,</span>&nbsp;<span class="xs:block lg:inline"><i class="xs:text-serif-38 lg:text-serif-66">interact</i>&nbsp; with.</span>
             <span class="text-line lg:-translate-y-6 from-scale dark ic xs:!w-250 lg:!w-600 xs:translate-x-[25%] md:translate-x-[90%] lg:-translate-x-[5%]"></span>
           </p>`,
    isCase: false,
    link: ''
  },
  {
    id: 'block_18',
    className: 'xs:top-1/9 2xl:top-1/8 xl:top-1/17 left-1/2 xs:w-full lg:w-auto -translate-x-1/2 -translate-y-2/2',
    scrollStart: (e, isMobile, isTablet) => e(10) + 150,
    scrollEnd: (e, isMobile, isTablet) => e(10) + 250,
    scrollStart2: (e, isMobile, isTablet) => e(11) + 220 - (window.innerHeight < 850 ? 40 : 0),
    scrollEnd2: (e, isMobile, isTablet) => e(11) + 420 - (window.innerHeight < 850 ? 40 : 0),
    content: `<p class='xs:text-sans-18 lg:text-sans-26 text-center'>
             <span class="text-icon-feather-white ic xs:mb-20 lg:mb-56 !block mx-auto"></span>
             <span class="inline-block xs:mb-8 lg:mb-0">How can the story live at the</span><br>
             <span class="xs:text-sans-38 lg:text-sans-66"><i class="xs:text-serif-38 lg:text-serif-66">heart</i> of the experience?</span><br>

           </p>`,
    isCase: false,
    link: ''
  },
  {
    id: 'block_19',
    className: 'bottom-0 xs:pl-20 lg:pl-0 lg:right-1/10 w-410',
    scrollStart: (e, isMobile, isTablet) => e(11) + 100 + 60,
    scrollEnd: (e, isMobile, isTablet) => e(11) + 150 + 60,
    scrollStart2: (e, isMobile, isTablet) => e(11) + 160,
    scrollEnd2: (e, isMobile, isTablet) => e(11) + 360,
    content: `<p class='xs:text-sans-18 lg:text-sans-26 text-left'>
             <span class="xs:text-sans-26 lg:text-sans-38">Start with <i class="xs:text-serif-26 lg:text-serif-38">clarity</i></span><br>
             <span class="text-line from-scale dark xs:my-10 lg:my-20 ic !w-600 -translate-x-[30%]"></span>
             <span class="lg:lines-text-gradient">Know what you’re trying to say.</span><br>
             <span class="lg:lines-text-gradient">Whether it’s launching a product or</span><br>
             <span class="lg:lines-text-gradient">building emotional connections,</span><br>
             <span class="lg:lines-text-gradient">the goal needs to be clear.</span><br>
           </p>`,
    isCase: false,
    link: ''
  },
  {
    id: 'block_20',
    className: 'bottom-0 xs:pr-40 lg:pr-0 xs:right-0 lg:left-1/10 w-410',
    scrollStart: (e, isMobile, isTablet) => e(11) + 170 + 60,
    scrollEnd: (e, isMobile, isTablet) => e(11) + 220 + 60,
    scrollStart2: (e, isMobile, isTablet) => e(11) + 170 + 60,
    scrollEnd2: (e, isMobile, isTablet) => e(11) + 420 + 10,
    content: `<p class='xs:text-sans-18 lg:text-sans-26 text-right'>
             <span class="xs:text-sans-26 lg:text-sans-38">Let the story <i class="xs:text-serif-26 lg:text-serif-38">guide</i> design</span><br>
             <span class="text-line from-scale dark xs:my-10 lg:my-20 ic !w-500 -translate-x-[5%]"></span>
             <span class="lg:lines-text-gradient-left">Every animation, interaction,</span><br>
             <span class="lg:lines-text-gradient-left">and visual should serve the</span><br>
             <span class="lg:lines-text-gradient-left">narrative. If it doesn’t help</span><br>
             <span class="lg:lines-text-gradient-left">tell the story, it’s not needed.</span><br>
           </p>`,
    isCase: false,
    link: ''
  },
  {
    id: 'block_21',
    className: 'bottom-0 xs:pl-20 lg:pl-0 lg:right-1/10 w-410',
    scrollStart: (e, isMobile, isTablet) => e(11) + 240 + 60,
    scrollEnd: (e, isMobile, isTablet) => e(11) + 290 + 60,
    scrollStart2: (e, isMobile, isTablet) => e(11) + 240 + 60,
    scrollEnd2: (e, isMobile, isTablet) => e(11) + 490 + 10,
    content: `<p class='xs:text-sans-18 lg:text-sans-26 text-left'>
             <span class="xs:text-sans-26 lg:text-sans-38"><i class="xs:text-serif-26 lg:text-serif-38">Experiment</i> and iterate</span><br>
             <span class="text-line from-scale dark xs:my-10 lg:my-20 ic !w-550 -translate-x-[30%]"></span>
             <span class="lg:lines-text-gradient">Some of the best ideas came from </span><br>
             <span class="lg:lines-text-gradient">simply trying things out, seeing</span><br>
             <span class="lg:lines-text-gradient">what clicked, and refining from there.</span><br>
           </p>`,
    isCase: false,
    link: ''
  },
  {
    id: 'block_22',
    className: 'bottom-0 xs:pr-40 lg:pr-0 xs:right-0 lg:left-1/10 w-410',
    scrollStart: (e, isMobile, isTablet) => e(11) + 310 + 60,
    scrollEnd: (e, isMobile, isTablet) => e(11) + 360 + 60,
    scrollStart2: (e, isMobile, isTablet) => e(11) + 310 + 60,
    scrollEnd2: (e, isMobile, isTablet) => e(11) + 560 + 10,
    content: `<p class='xs:text-sans-18 lg:text-sans-26 text-right'>
             <span class="xs:text-sans-26 lg:text-sans-38">Make it <i class="xs:text-serif-26 lg:text-serif-38">personal</i></span><br>
             <span class="text-line from-scale dark xs:my-10 lg:my-20 ic !w-600 -translate-x-[15%]"></span>
             <span class="lg:lines-text-gradient-left">The best stories create emotional</span><br>
             <span class="lg:lines-text-gradient-left">connections. Whether through AI</span><br>
             <span class="whitespace-nowrap lg:lines-text-gradient-left">personalization or custom design</span><br>
             <span class="lg:lines-text-gradient-left">elements, find ways to make the</span><br>
             <span class="lg:lines-text-gradient-left">experience unique for each user.</span>
           </p>`,
    isCase: false,
    link: ''
  },
  {
    id: 'block_23',
    className: 'top-1/8 left-1/2 -translate-x-1/2 xs:w-full lg:w-auto',
    scrollStart: (e, isMobile, isTablet) => e(15) + 40,
    scrollEnd: (e, isMobile, isTablet) => e(15) + 130,
    scrollStart2: (e, isMobile, isTablet) => e(15) + 225 - (isMobile ? 50 : 0) - (isTablet ? 70 : 0),
    scrollEnd2: (e, isMobile, isTablet) => e(15) + 430 - (isMobile ? 10 : 0) - (isTablet ? 70 : 0),
    content: `<p class='xs:text-sans-38 lg:text-sans-66 text-center'>
             <span>Where <i class="xs:text-serif-38 lg:text-serif-66 lg:mr-3">stories</i></span><br>
             <span class="inline-block lg:-translate-y-10">become experiences</span><br>
           </p>`,
    isCase: false,
  },
];

export { TEXT_BLOCKS };

