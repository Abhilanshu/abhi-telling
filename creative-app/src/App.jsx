import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import Experience from './components/Experience';
import AudioComponent, { audioController } from './components/AudioComponent';
import { TEXT_BLOCKS } from './data/formatted_blocks_clean';

gsap.registerPlugin(ScrollTrigger);

// ─── HELPER FOR TEXT SPLITTING ──────────────────────────────────
function splitTextIntoChars(el) {
  if (!el) return;
  
  // 1. Mark .ic elements as char
  el.querySelectorAll(".ic").forEach(ic => {
    ic.classList.add("char");
    ic.style.display = "inline-block";
  });

  // 2. Recursively split text nodes
  const recurse = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text.trim() && text.indexOf('\n') !== -1) return;
      
      const parent = node.parentNode;
      const frag = document.createDocumentFragment();
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ' || char === '\n' || char === '\t') {
          frag.appendChild(document.createTextNode(char));
        } else {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = char;
          frag.appendChild(span);
        }
      }
      
      parent.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.classList.contains('ic') || node.classList.contains('char')) return;
      const children = Array.from(node.childNodes);
      children.forEach(recurse);
    }
  };

  recurse(el);
}

// ─── RESPONSIVE SEGMENT LENGTHS ────────────────────────────────
const DESKTOP_SEGMENTS = [100, 150, 300, 300, 200, 300, 500, 200, 80, 80, 170, 190, 280, 50, 50, 100, 140, 560, 200, 280];
const MOBILE_SEGMENTS  = [50, 75, 150, 150, 100, 150, 250, 100, 40, 40, 170, 190, 280, 50, 50, 100, 140, 1100, 250, 280];

const getCumulativeScroll = (k) => {
  const isMobile = window.innerWidth < 1024;
  const segments = isMobile ? MOBILE_SEGMENTS : DESKTOP_SEGMENTS;
  let sum = 0;
  for (let i = 0; i <= k; i++) {
    if (segments[i] !== undefined) {
      sum += segments[i];
    }
  }
  return sum;
};

const getScrollVH = () => {
  const isMobile = window.innerWidth < 1024;
  return isMobile ? 36.95 : 42.30;
};

// ─── PRELOADER ─────────────────────────────────────────────────
function Loader({ onLoaded }) {
  const { progress } = useProgress();
  const ref = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (progress < 100) return;
    const t = setTimeout(() => {
      if (!ref.current) return;
      ref.current.classList.add('revealing');
      const dur = 1400, t0 = performance.now();
      const step = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        const e = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
        if (ref.current) ref.current.style.setProperty('--reveal-radius', `${e*165}vmax`);
        if (p < 1) requestAnimationFrame(step);
        else { if (ref.current) ref.current.classList.add('hidden'); setTimeout(() => { setDone(true); onLoaded(); }, 400); }
      };
      requestAnimationFrame(step);
    }, 600);
    return () => clearTimeout(t);
  }, [progress, onLoaded]);

  if (done) return null;
  return (
    <div ref={ref} className="preloader-screen">
      <div className="preloader-inner">
        <img src="/images/loader.gif" alt="Loading..." className="preloader-logo" />
        <div className="preloader-pct">LOADING {Math.round(progress)}%</div>
      </div>
    </div>
  );
}

// ─── HERO H1 — "storytelling" per-char gradient ─────────────────
const CHARS = 'storytelling'.split('');
function HeroH1() {
  return (
    <h1>
      {CHARS.map((ch, i) => (
        <span key={i} className={`char char${i + 1}`}>{ch}</span>
      ))}
    </h1>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded]                     = useState(false);
  const [experienceStarted, setExperienceStarted] = useState(false);
  const [soundEnabled, setSoundEnabled]         = useState(false);
  const [firstClick, setFirstClick]             = useState(false);
  const [isMobile, setIsMobile]                 = useState(false);
  const [scrollIndicator, setScrollIndicator]   = useState(false);
  const [releaseVisible, setReleaseVisible]     = useState(false);
  const [footerVisible, setFooterVisible]       = useState(false);
  const [isTransitioning, setIsTransitioning]   = useState(false);
  const [clickedCaseIndex, setClickedCaseIndex] = useState(-1);
  const isTransitioningRef                      = useRef(false);

  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  const handleSelectCase = (link, index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setClickedCaseIndex(index);
    setTimeout(() => {
      window.location.href = link;
    }, 1200);
  };

  const cursorRef = useRef(null);
  const ringRef   = useRef(null);

  // Virtual scroll state
  const currentY = useRef(0);
  const targetY  = useRef(0);

  // ── Mobile detection ──
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Custom cursor ──
  const mousePos  = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    window.updateCustomCursor = (hovered, text) => {
      if (cursorRef.current) cursorRef.current.classList.toggle('hovered', hovered);
      const el = document.querySelector('.cursor-ring-text');
      if (el) el.textContent = text || '';
    };
    return () => { delete window.updateCustomCursor; };
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const onMove = (e) => { mousePos.current.x = e.clientX; mousePos.current.y = e.clientY; };
    window.addEventListener('mousemove', onMove);
    let raf;
    const tick = () => {
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;
      if (cursorRef.current) cursorRef.current.style.transform = `translate3d(calc(${mousePos.current.x}px - 50%), calc(${mousePos.current.y}px - 50%), 0)`;
      if (ringRef.current) {
        const dx = cursorPos.current.x - mousePos.current.x;
        const dy = cursorPos.current.y - mousePos.current.y;
        ringRef.current.style.transform = `translate3d(calc(-50% + ${dx}px), calc(-50% + ${dy}px), 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, [isMobile]);

  // ── CINEMATIC LERP SCROLL ──
  useEffect(() => {
    if (!experienceStarted) return;
    const maxScroll = window.innerHeight * getScrollVH();

    const onWheel = (e) => {
      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      // Original feel: ~0.5× speed, max 80px per event
      const d = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) * 0.5, 80);
      targetY.current = Math.max(0, Math.min(targetY.current + d, maxScroll));
    };

    let touchY = 0;
    const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
    const onTouchMove  = (e) => {
      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const d = (touchY - e.touches[0].clientY) * 1.5;
      targetY.current = Math.max(0, Math.min(targetY.current + d, maxScroll));
      touchY = e.touches[0].clientY;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    let raf;
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      currentY.current = lerp(currentY.current, targetY.current, 0.06);
      // Write virtual scroll as CSS var (negative for transform use)
      document.documentElement.style.setProperty('--scroll-y', `${-currentY.current}px`);
      // Write progress (0–1) for 3D scene
      const prog = Math.max(0, Math.min(currentY.current / maxScroll, 1));
      document.documentElement.style.setProperty('--scroll-progress', prog);
      ScrollTrigger.update();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(raf);
    };
  }, [experienceStarted]);

  // Expose virtual scroll setter for external control/debugging
  useEffect(() => {
    if (!experienceStarted) return;
    window.scrollToVirtual = (y) => {
      targetY.current = Math.max(0, Math.min(y, window.innerHeight * getScrollVH()));
    };
    return () => {
      delete window.scrollToVirtual;
    };
  }, [experienceStarted]);

  // ── ScrollTrigger virtual scroller proxy ──
  useEffect(() => {
    if (!experienceStarted) return;
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) { currentY.current = value; targetY.current = value; }
        return currentY.current;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });
    ScrollTrigger.addEventListener('refresh', () => ScrollTrigger.update());
    ScrollTrigger.refresh();
  }, [experienceStarted]);

  // ── Start experience ──
  const handleStart = () => {
    if (experienceStarted) return;
    setExperienceStarted(true);
    setSoundEnabled(true);
    setFirstClick(true);
    setTimeout(() => setScrollIndicator(true), 800);
  };

  // ── Text section scroll triggers ──
  useEffect(() => {
    if (!experienceStarted) return;

    const px = (units) => (units / 100) * window.innerHeight;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const scrollTriggers = [];

    // 1. Unified TEXT_BLOCKS Scroll Sync
    TEXT_BLOCKS.forEach((block) => {
      const parentEl = document.querySelector(`[data-block-id="${block.id}"]`);
      if (!parentEl) return;

      const innerEl = parentEl.querySelector('.inner-element');
      if (!innerEl) return;

      // Split text into characters
      splitTextIntoChars(innerEl);

      // Find all char elements
      const chars = [...innerEl.querySelectorAll('.char')];
      if (!chars.length) return;

      // Evaluate scroll limits in vh% units
      const scrollStart = block.scrollStart(getCumulativeScroll, isMobile, isTablet);
      const scrollEnd = block.scrollEnd(getCumulativeScroll, isMobile, isTablet);
      const scrollStart2 = block.scrollStart2 ? block.scrollStart2(getCumulativeScroll, isMobile, isTablet) : null;
      const scrollEnd2 = block.scrollEnd2 ? block.scrollEnd2(getCumulativeScroll, isMobile, isTablet) : null;

      // Overall active range for visibility toggling
      const overallStart = scrollStart2 !== null ? Math.min(scrollStart, scrollStart2) : scrollStart;
      const overallEnd = scrollEnd2 !== null ? Math.max(scrollEnd, scrollEnd2) : scrollEnd;

      // Toggle display visibility
      const toggleTrigger = ScrollTrigger.create({
        scroller: document.body,
        start: () => `top+=${px(overallStart)} top`,
        end: () => `top+=${px(overallEnd)} top`,
        onToggle: (self) => {
          parentEl.style.display = self.isActive ? 'block' : 'none';
        }
      });
      scrollTriggers.push(toggleTrigger);

      // Setup stagger animations
      const blurIn = isMobile ? 'none' : 'blur(8px)';
      const blurOut = isMobile ? 'none' : 'blur(0px)';

      // Entrance ScrollTrigger
      const trigger1 = ScrollTrigger.create({
        scroller: document.body,
        start: () => `top+=${px(scrollStart)} top`,
        end: () => `top+=${px(scrollEnd)} top`,
        scrub: true,
        animation: gsap.fromTo(chars, 
          { opacity: 0, scale: 1.3, filter: blurIn },
          { opacity: 1, scale: 1, filter: blurOut, stagger: 0.05, ease: 'none' }
        )
      });
      scrollTriggers.push(trigger1);

      // Exit ScrollTrigger (if scrollStart2 / scrollEnd2 defined)
      if (scrollStart2 !== null && scrollEnd2 !== null) {
        const trigger2 = ScrollTrigger.create({
          scroller: document.body,
          start: () => `top+=${px(scrollStart2)} top`,
          end: () => `top+=${px(scrollEnd2)} top`,
          scrub: true,
          animation: gsap.fromTo(chars,
            { opacity: 1, scale: 1, filter: blurOut },
            { opacity: 0, scale: 1.3, filter: blurIn, stagger: 0.05, ease: 'none' }
          )
        });
        scrollTriggers.push(trigger2);
      }
    });

    // 2. Dark mode trigger at section 7 (ends crystals section, transitions to dark mode)
    const darkT = ScrollTrigger.create({
      scroller: document.body,
      start: () => px(getCumulativeScroll(7)),
      end:   () => px(getCumulativeScroll(19)),
      onEnter:     () => {
        document.body.classList.add('dark-mode');
        document.documentElement.classList.add('dark-mode');
      },
      onLeaveBack: () => {
        document.body.classList.remove('dark-mode');
        document.documentElement.classList.remove('dark-mode');
      },
    });
    scrollTriggers.push(darkT);

    // 3. "Reimagine Phoenix" button trigger
    const releaseT = ScrollTrigger.create({
      scroller: document.body,
      start: () => px(getCumulativeScroll(14)),
      end:   () => px(getCumulativeScroll(17)),
      onEnter:     () => setReleaseVisible(true),
      onLeave:     () => setReleaseVisible(false),
      onEnterBack: () => setReleaseVisible(true),
      onLeaveBack: () => setReleaseVisible(false),
    });
    scrollTriggers.push(releaseT);

    // 4. Hide scroll indicator trigger
    const hideT = ScrollTrigger.create({
      scroller: document.body,
      start: () => px(50),
      onEnter: () => setScrollIndicator(false),
    });
    scrollTriggers.push(hideT);

    // 5. Footer visibility trigger
    const footerT = ScrollTrigger.create({
      scroller: document.body,
      start: () => px(getCumulativeScroll(17)),
      onEnter:     () => setFooterVisible(true),
      onLeaveBack: () => setFooterVisible(false),
    });
    scrollTriggers.push(footerT);

    return () => { 
      scrollTriggers.forEach(t => {
        if (t.animation) t.animation.kill();
        t.kill();
      });
    };
  }, [experienceStarted, isMobile]);

  return (
    <>
      {/* ── Custom cursor ── */}
      {!isMobile && (
        <div ref={cursorRef} className="custom-cursor">
          <div className="cursor-dot" />
          <div ref={ringRef} className="cursor-ring">
            <span className="cursor-ring-text"></span>
          </div>
        </div>
      )}

      {/* ── Preloader ── */}
      <Loader onLoaded={() => setLoaded(true)} />

      {/* ── Audio ── */}
      <AudioComponent soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} firstClick={firstClick} />

      {/* ── Fixed WebGL Canvas ── */}
      <div className="webgl-container">
        <Canvas
          id="webgl-canvas"
          flat
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: 0 }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <Experience 
              isMobile={isMobile} 
              experienceStarted={experienceStarted} 
              onSelectCase={handleSelectCase} 
              clickedCaseIndex={clickedCaseIndex}
              isTransitioning={isTransitioning}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ── Sound toggle ── */}
      {experienceStarted && (
        <button
          id="sound-btn"
          className={`sound-toggle interactive ${soundEnabled ? 'active' : ''}`}
          onClick={() => setSoundEnabled(!soundEnabled)}
          onMouseEnter={() => window.updateCustomCursor?.(true, soundEnabled ? 'Mute' : 'Sound')}
          onMouseLeave={() => window.updateCustomCursor?.(false, '')}
        >
          <div className="sound-bars">{[1,2,3,4,5].map(i => <div key={i} className="sound-bar" />)}</div>
          <span>{soundEnabled ? 'SOUND ON' : 'SOUND OFF'}</span>
        </button>
      )}

      {/* ── Reimagine Phoenix button ── */}
      <div id="release-btn" className={`release-spirit ${releaseVisible ? 'visible' : ''}`}>
        <div className="wrapper">
          <div className="gradient gradient-1" />
          <div className="gradient gradient-2" />
          <div className="bb" />
          <img alt="pixel bird" className="pixel-bird" src="/images/text_icons/pixelBird.png" />
          <p className="label-text">Reimagine Phoenix</p>
          <div className="circle" />
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className={`scroll-indicator ${scrollIndicator ? 'visible' : ''}`}>
        <span>Scroll to explore</span>
        <span className="scroll-line" />
      </div>

      {/* ── Mobile tap button ── */}
      {loaded && !experienceStarted && (
        <div className={`mobile-tap-btn interactive ${loaded ? 'visible' : ''}`} onClick={handleStart}>
          <div className="mobile-tap-inner">
            <img alt="star" src="/images/svg/buttonStar.svg" />
            <span>Tap to explore</span>
            <img alt="star" src="/images/svg/buttonStar.svg" />
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────
          UI LAYER
      ───────────────────────────────────── */}
      <div className={`ui-layer ${isTransitioning ? 'fade-out' : ''}`}>

        {/* HEADER */}
        <header>
          <div className="logo interactive">
            <div className="logo-text" onClick={() => window.location.href = '/'}>
              abhi <span className="serif-italic">telling</span>
            </div>
          </div>
        </header>

        {/* HERO + START OVERLAY (before experience) */}
        {loaded && !experienceStarted && (
          <div className="start-overlay">
            <div className="hero-text-block">
              <h2 className="hero-h2">
                The power<br />
                <span className="serif-italic">of</span> digital
              </h2>
              <HeroH1 />
            </div>
            <button
              id="tap-to-explore-btn"
              className="start-screen-btn interactive"
              onClick={handleStart}
              onMouseEnter={() => window.updateCustomCursor?.(true, 'Explore')}
              onMouseLeave={() => window.updateCustomCursor?.(false, '')}
            >TAP TO EXPLORE</button>
          </div>
        )}

        {/* ══════════════════════════════════
            SCROLL TEXT SECTIONS (fixed overlay)
            All sections are fixed-position, fade in/out via GSAP
        ══════════════════════════════════ */}
        {experienceStarted && (
          <div className="sections-wrap">
            {TEXT_BLOCKS.map((block) => (
              <div
                key={block.id}
                id={block.id}
                className={`absolute animated-text ${block.className || ''}`}
                style={{ display: 'none' }}
                data-block-id={block.id}
              >
                {block.isCase ? (
                  <a 
                    href={block.link} 
                    className="inner-element interactive-case-link"
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    dangerouslySetInnerHTML={{ __html: block.content }}
                    onClick={(e) => {
                      e.preventDefault();
                      audioController.playSpirit();
                      const index = parseInt(block.id.replace('crystal', ''), 10);
                      handleSelectCase(block.link, index);
                    }}
                    onMouseEnter={() => window.updateCustomCursor?.(true, 'Click to view')}
                    onMouseLeave={() => window.updateCustomCursor?.(false, '')}
                  />
                ) : (
                  <div 
                    className="inner-element"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Footer ── */}
        {experienceStarted && (
          <footer className={`footer-wrap ${footerVisible ? 'visible' : ''}`}>
            <div></div>
            <div className="footer-contact">
              <p className="footer-tagline">
                Let us help you tell your story the way it was meant
              </p>
              
              <div className="footer-logo-wrapper">
                <div className="footer-logo-text">
                  abhi <span className="serif-italic">telling</span>
                </div>
              </div>
            </div>
            <div style={{ height: '20px' }}></div>
          </footer>
        )}

      </div>
    </>
  );
}
