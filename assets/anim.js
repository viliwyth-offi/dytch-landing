/* dytch motion — quiet, code-only GSAP polish. Secondary pages + footer only.
   Honors prefers-reduced-motion; no-ops if the CDN scripts fail to load.
   Reveals are fail-safe: every tween is force-completed by wall clock, so a
   stalled rAF (background tab, aggressive battery saver) can never leave
   content half-faded. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0); /* keep reveals wall-clock true on slow devices */

  /* One tween per element, played on enter, force-finished by wall clock. */
  function revealEach(targets, vars) {
    vars = vars || {};
    gsap.utils.toArray(targets).forEach(function (el, i) {
      var delay = (vars.stagger || 0) * i + (vars.delay || 0);
      var dur = vars.duration || 0.55;
      var tween = gsap.from(el, {
        y: vars.y != null ? vars.y : 22,
        opacity: 0,
        duration: dur,
        delay: delay,
        ease: vars.ease || 'power2.out',
        paused: true
      });
      var finish = function () { if (tween.progress() < 1) tween.progress(1); };
      var played = false;
      var go = function () {
        if (played) return;
        played = true;
        tween.play();
        setTimeout(finish, (delay + dur) * 1000 + 800);
      };
      if (vars.onLoad) {
        go();
      } else {
        var st = ScrollTrigger.create({
          trigger: el,
          start: vars.start || 'top bottom',
          once: true,
          onEnter: go
        });
        /* If the trigger sits beyond the furthest the page can scroll
           (short pages, tall viewports), it can never fire - play now. */
        setTimeout(function () {
          var realMax = Math.max(document.documentElement.scrollHeight,
                                 document.body.scrollHeight) - window.innerHeight;
          if (!played && st.start > realMax - 2) go();
        }, 1200);
      }
    });
  }

  /* Footer: a slow, small rise as it enters view. Runs on every page. */
  revealEach('.foot .foot-in > *', { y: 24, duration: 0.7, stagger: 0.12 });

  /* Blog index: heading settles in, cards stagger up. */
  if (document.querySelector('.blog-list')) {
    revealEach('.sec .eyebrow, .sec h2, .sec .wrap > p', { y: 16, stagger: 0.07, onLoad: true });
    revealEach('.blog-card', { y: 32, duration: 0.6, ease: 'power3.out', stagger: 0.09 });
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
    revealEach(article.querySelectorAll(':scope > .eyebrow, :scope > h1, :scope > .meta'),
      { y: 14, stagger: 0.07, onLoad: true });
    revealEach(article.querySelectorAll('h2, .cta-box'), { y: 22 });
  }
})();
