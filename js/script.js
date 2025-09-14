// Copyright-Jahr
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Slider Setup
(function() {
  const track = document.getElementById('sliderTrack');
  const viewport = track ? track.parentElement : null;
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!track || !viewport || !prevBtn || !nextBtn) return;

  let perView = 3;
  const mq2 = window.matchMedia('(max-width: 1000px)');
  const mq1 = window.matchMedia('(max-width: 640px)');
  function calcPerView(){
    if (mq1.matches) return 1;
    if (mq2.matches) return 2;
    return 3;
  }

  let slides = Array.from(track.children);

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

  let slideW = 0, idx = 0, timer = null, isAnimating = false;

  function setSizes(){
    perView = calcPerView();
    const vw = viewport.clientWidth;
    slideW = vw / perView;
    Array.from(track.children).forEach(el => { el.style.width = slideW + 'px'; });
    cloneForLoop();
    jumpTo(idx);
  }

  function jumpTo(i){
    idx = i;
    track.style.transition = 'none';
    track.style.transform = `translateX(${-idx * slideW}px)`;
    void track.offsetHeight;
    track.style.transition = '';
  }

  function next(){ if(!isAnimating) goTo(idx + 1); }
  function prev(){ if(!isAnimating) goTo(idx - 1); }

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

  function start(){ stop(); timer = setInterval(next, 3500); }
  function stop(){ if (timer) clearInterval(timer); timer = null; }

  prevBtn.addEventListener('click', () => { stop(); prev(); start(); });
  nextBtn.addEventListener('click', () => { stop(); next(); start(); });
  viewport.addEventListener('mouseenter', stop);
  viewport.addEventListener('mouseleave', start);
  window.addEventListener('resize', setSizes);

  setSizes();
  start();
})();

// Kontaktformular (Demo)
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
