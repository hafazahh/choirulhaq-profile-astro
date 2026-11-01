/**
 * floating-ad.js — behaviour for the FloatingAd markup in BaseLayout.
 *
 * Kept in public/ rather than inside the Astro component for one reason: this
 * site's CSP is `script-src 'self'` with no 'unsafe-inline', and that is what
 * keeps the security grade at A+. A component-local <script> is emitted by
 * Astro as an inline module (verified in dist/index.html), which that policy
 * blocks outright. An external file under the same origin is allowed and
 * behaves identically.
 *
 * Responsibilities:
 *   - reveal the bar only after the reader has scrolled far enough that it is
 *     a response to interest, not an obstacle to starting;
 *   - make the close button final for the session;
 *   - reserve the bar's own height so the page's last line stays reachable.
 */
(function () {
  var STORAGE_KEY = "floatingAdDismissed";
  var SCROLL_RATIO = 0.35;

  var bar = document.getElementById("floating-ad");
  var closeBtn = document.getElementById("floating-ad-close");
  if (!bar || !closeBtn) return;

  function dismissed() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch (err) {
      // Safari private mode throws on access; fall back to a memory flag.
      return window.__floatAdDismissed === true;
    }
  }

  function persistDismissed() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch (err) {
      window.__floatAdDismissed = true;
    }
  }

  function open() {
    if (dismissed()) return;
    bar.hidden = false;
    // Force a reflow so the transition starts from the hidden position.
    void bar.offsetHeight;
    bar.dataset.visible = "true";
    document.body.setAttribute("data-floating-ad-open", "true");
    setReservedHeight();

    // Request the ad only while the bar is actually on screen, so an
    // impression is counted when it can be seen.
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // Loader blocked, offline, or ad blocker: the page is unaffected.
    }
  }

  function setReservedHeight() {
    if (bar.dataset.visible !== "true") return;
    var h = Math.ceil(bar.getBoundingClientRect().height);
    if (h > 0) document.body.style.setProperty("--floating-ad-h", h + "px");
  }

  function close() {
    bar.hidden = true;
    document.body.removeAttribute("data-floating-ad-open");
    persistDismissed();
  }

  function onScroll() {
    if (dismissed() || bar.dataset.visible === "true") return;
    var scrolled = window.scrollY + window.innerHeight;
    var total = document.documentElement.scrollHeight;
    if (total > 0 && scrolled / total >= SCROLL_RATIO) open();
  }

  closeBtn.addEventListener("click", close);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", setReservedHeight, { passive: true });

  // The ad usually paints after open(), and a filled unit is taller than an
  // empty one — keep the reservation in step without needing a resize event.
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(setReservedHeight).observe(bar);
  }
})();
