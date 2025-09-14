// Jahr im Footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Slider (Desktop aktiv; Mobil nativ scroll-snap) =====
(function() {
  const track = document.getElementById('sliderTrack');
  if (!track) return;

  const viewport = track.parentElement;
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const mqMobile = window.matchMedia('(max-width: 740px)');

  let perView = 3, slideW = 0, idx = 0, timer = null, isAnimating = false;
  let slides = Array.from(track.children);

  function isMobile(){ return mqMobile.matches; }

  function cloneForLoop(){
    track.querySelectorAll('.clone').forEach(el => el.remove());
    slides = Array.from(track.children).filter(el => !el.classList.contains('clone'));
    const clonesNeeded = perView;
    for (let i=0; i<clonesNeeded; i++) {
      const c = slides[i % slides.length].cloneNode(true);
      c.classList.add('clone');
      track.appendChild(c);
    }
  }

  function calcPerView(){
    const mq2 = window.matchMedia('(max-width: 1000px)');
    const mq1 = window.matchMedia('(max-width: 640px)');
    if (mq1.matches) return 1;
    if (mq2.matches) return 2;
    return 3;
  }

  function jumpTo(i){
    idx = i;
    track.style.transition = 'none';
    track.style.transform = `translateX(${-idx * slideW}px)`;
    void track.offsetHeight;
    track.style.transition = '';
  }

  function goTo(target){
    isAnimating = true;
    track.style.transform = `translateX(${-target * slideW}px)`;
    const onEnd = () => {
      track.removeEventListener('transitionend', onEnd);
      const baseCount = slides.length;
      if (target >= baseCount) { target = target - baseCount; }
      if (target < 0) { target = baseCount + target; }
      jumpTo(target);
      isAnimating = false;
    };
    track.addEventListener('transitionend', onEnd, { once: true });
    idx = target;
  }

  function next(){ if(!isAnimating) goTo(idx + 1); }
  function prev(){ if(!isAnimating) goTo(idx - 1); }

  function start(){ stop(); timer = setInterval(next, 3500); }
  function stop(){ if (timer) clearInterval(timer); timer = null; }

  function enableDesktopSlider(){
    // Größen/Clones berechnen
    perView = calcPerView();
    const vw = viewport.clientWidth;
    slideW = vw / perView;
    Array.from(track.children).forEach(el => { el.style.width = slideW + 'px'; });
    cloneForLoop();
    jumpTo(idx);

    // Controls (falls vorhanden)
    if (prevBtn && nextBtn) {
      prevBtn.onclick = () => { stop(); prev(); start(); };
      nextBtn.onclick = () => { stop(); next(); start(); };
    }

    // Hover-Pause
    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', start);
    window.addEventListener('resize', setUp); // Neu berechnen bei Resize
    start();
  }

  function disableDesktopSlider(){
    // Autoplay stoppen und Styles zurücksetzen – native Scroll übernimmt
    stop();
    track.querySelectorAll('.clone').forEach(el => el.remove());
    track.style.transform = 'none';
    track.style.transition = '';
    Array.from(track.children).forEach(el => { el.style.width = ''; });
    if (prevBtn && nextBtn) {
      prevBtn.onclick = null;
      nextBtn.onclick = null;
    }
    viewport.removeEventListener('mouseenter', stop);
    viewport.removeEventListener('mouseleave', start);
    window.removeEventListener('resize', setUp);
  }

  function setUp(){
    if (isMobile()){
      disableDesktopSlider();  // Mobil: kein JS-Slider, native Scroll-Snap
    } else {
      disableDesktopSlider();  // sicherstellen, dass wir sauber starten
      enableDesktopSlider();   // Desktop: klassischer Slider
    }
  }

  mqMobile.addEventListener('change', setUp);
  setUp();
})();

// ===== Kontaktformular (Demo) =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const note = document.getElementById('formNote');
    const ok = document.getElementById('privacy').checked;
    if (!ok) {
      note.textContent = 'Bitte stimmen Sie der Datenverarbeitung zu.';
      return;
    }
    note.textContent = 'Danke! Ihre Nachricht wurde lokal übermittelt (Demo).';
  });
}
