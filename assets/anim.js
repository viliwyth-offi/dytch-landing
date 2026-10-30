/* dytch motion — quiet, code-only GSAP polish. Secondary pages + footer only.
   Honors prefers-reduced-motion; no-ops if the CDN scripts fail to load. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  /* Footer: a slow, small rise as it enters view. Runs on every page. */
  var footIn = document.querySelector('.foot .foot-in');
  if (footIn) {
    gsap.from(footIn.children, {
      y: 24,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '.foot', start: 'top 94%' }
    });
  }

  /* Blog index: heading settles in, cards stagger up. */
  var list = document.querySelector('.blog-list');
  if (list) {
    gsap.from('.sec .eyebrow, .sec h2, .sec .wrap > p', {
      y: 16, opacity: 0, duration: 0.55, ease: 'power2.out', stagger: 0.07
    });
    gsap.from(list.querySelectorAll('.blog-card'), {
      y: 32,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.09,
      scrollTrigger: { trigger: list, start: 'top 90%' }
    });
  }

  /* Blog posts: thin reading-progress bar, title in, sections rise as read. */
  var article = document.querySelector('article.article');
  if (article) {
    var bar = document.createElement('div');
    bar.className = 'read-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: article, start: 'top 55%', end: 'bottom 85%', scrub: 0.4 }
    });
    gsap.from(article.querySelectorAll(':scope > .eyebrow, :scope > h1, :scope > .meta'), {
      y: 14, opacity: 0, duration: 0.55, ease: 'power2.out', stagger: 0.07
    });
    gsap.utils.toArray(article.querySelectorAll('h2, .cta-box')).forEach(function (el) {
      gsap.from(el, {
        y: 22,
        opacity: 0,
        duration: 0.55,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });
  }
})();
