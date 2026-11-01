/**
 * floating-ad.js — behaviour for the FloatingAd markup in BaseLayout.
 *
 * Kept in public/ rather than inside the Astro component for one reason: this
 * site's CSP is `script-src 'self'` with no 'unsafe-inline', and that is what
 * keeps the security grade at A+. A component-local script is emitted by
 * Astro as an inline module (verified in dist/index.html), which that policy
 * blocks outright. An external file under the same origin is allowed and
 * behaves identically.
 *
 * Responsibilities:
 *   - reveal the bar only after the reader has scrolled far enough that it is
 *     a response to interest, not an obstacle to starting;
 *   - let the bar come back after a cooldown, so closing it means "not now"
 *     rather than "never" — with no per-day cap, so a return is only ever
 *     gated by the cooldown;
 *   - return on its own, without the reader having to scroll again;
 *   - reserve the bar's own height so the page's last line stays reachable.
 */
(function () {
  var STORAGE_KEY = "floatingAdDismissedAt";
  var SCROLL_RATIO = 0.35;
  var COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes before the bar may return
  var CHECK_INTERVAL_MS = 30 * 1000; // re-check even while the reader is still

  var bar = document.getElementById("floating-ad");
  var closeBtn = document.getElementById("floating-ad-close");
  if (!bar || !closeBtn) return;

  /**
   * Milliseconds since the bar was last closed, or Infinity if never.
   * The value is also mirrored to a page variable, because Safari in private
   * mode throws on localStorage access — returning Infinity when storage is
   * blocked would mean "never dismissed" and the bar would return on every
   * scroll, which is worse than not returning at all.
   */
  function sinceDismissed() {
    var raw;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      raw = window.__floatAdDismissedAt || null;
    }
    if (!raw) return Infinity;
    return Date.now() - parseInt(raw, 10);
  }

  function persistDismissed() {
    var now = String(Date.now());
    try {
      localStorage.setItem(STORAGE_KEY, now);
    } catch (err) {
      window.__floatAdDismissedAt = now;
    }
  }

  /** May the bar show now? The cooldown is the only gate left. */
  function cooldownElapsed() {
    return sinceDismissed() >= COOLDOWN_MS;
  }

  /** True when a slot has already been filled — a second push throws. */
  function slotAlreadyFilled() {
    var slot = bar.querySelector("ins.adsbygoogle");
    return (
      !slot ||
      slot.getAttribute("data-adsbygoogle-status") === "done" ||
      slot.querySelector("iframe") !== null
    );
  }

  function open() {
    if (!cooldownElapsed()) return;
    bar.hidden = false;
    // Force a reflow so the transition starts from the hidden position.
    void bar.offsetHeight;
    bar.dataset.visible = "true";
    document.body.setAttribute("data-floating-ad-open", "true");
    setReservedHeight();

    // Request the ad once, while the bar is actually on screen. The same
    // <ins> element is reused on every showing, and AdSense refuses a second
    // push for a slot it has already filled, so a repeat would leave the bar
    // empty — hence the guard rather than a retry.
    if (!slotAlreadyFilled()) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        // Loader blocked, offline, or ad blocker: the page is unaffected.
      }
    }
  }

  function setReservedHeight() {
    if (bar.dataset.visible !== "true") return;
    var h = Math.ceil(bar.getBoundingClientRect().height);
    if (h > 0) document.body.style.setProperty("--floating-ad-h", h + "px");
  }

  function close() {
    bar.hidden = true;
    // Clearing this flag is what lets the bar come back later: the visibility
    // check bails out while it reads "true", so leaving it set after a close
    // would keep the bar away permanently even after the cooldown expires.
    bar.dataset.visible = "false";
    document.body.removeAttribute("data-floating-ad-open");
    persistDismissed();
  }

  /**
   * Show the bar when both hold: the cooldown has elapsed, and the reader is
   * far enough down the page. Called from scroll, from the timer, and once on
   * load so a reload after the cooldown still finds it.
   */
  function maybeShow() {
    if (!cooldownElapsed() || bar.dataset.visible === "true") return;
    var scrolled = window.scrollY + window.innerHeight;
    var total = document.documentElement.scrollHeight;
    if (total > 0 && scrolled / total >= SCROLL_RATIO) open();
  }

  closeBtn.addEventListener("click", close);
  window.addEventListener("scroll", maybeShow, { passive: true });
  window.addEventListener("resize", setReservedHeight, { passive: true });

  // Why this timer exists: the only trigger used to be a scroll event, and a
  // reader who closes the bar usually stops scrolling — so the cooldown
  // expired with nothing to notice it, which is exactly the "never comes back"
  // symptom. Polling makes the return happen on its own.
  setInterval(maybeShow, CHECK_INTERVAL_MS);
  // Run once immediately too: after a reload the cooldown may already be over.
  maybeShow();

  // The ad usually paints after open(), and a filled unit is taller than an
  // empty one — keep the reservation in step without needing a resize event.
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(setReservedHeight).observe(bar);
  }
})();
