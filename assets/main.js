// ===== EDIT THESE =====
const SITE = {
  phone: "(240) 481-2399",     // shown on the page
  phoneDial: "+12404812399",   // used for tap-to-call / text (E.164 format)
  timeZone: "America/Chicago", // order days are based on this time zone
  orderDays: [6, 0, 1, 2],     // 0=Sun ... 6=Sat  → Sat, Sun, Mon, Tue
  closeLabel: ["6 PM", "5 PM", "5 PM", "5 PM", "5 PM", "5 PM", "5 PM"], // phone closes, Sun..Sat
};
// ======================

document.querySelectorAll(".js-call").forEach(a => a.href = "tel:" + SITE.phoneDial);
document.querySelectorAll(".js-text").forEach(a => a.href = "sms:" + SITE.phoneDial);
document.querySelectorAll(".js-phone").forEach(el => el.textContent = SITE.phone);
document.querySelectorAll(".js-year").forEach(el => el.textContent = new Date().getFullYear());

// Today's day of week in the business time zone
const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: SITE.timeZone }).format(new Date());
const today = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(dayName);
const open = SITE.orderDays.includes(today);

const status = document.querySelector(".js-status");
if (status) {
  status.textContent = open
    ? "● Taking orders today until " + SITE.closeLabel[today] + " — call now"
    : "● Orders reopen Saturday — text us anytime";
  status.classList.add(open ? "is-open" : "is-closed");
}

document.querySelectorAll(".week li").forEach(li => {
  if (Number(li.dataset.day) === today) li.classList.add("today");
});

// Hero photo: embers + gentle tilt
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = document.querySelector(".embers");
  if (box) {
    for (let i = 0; i < 12; i++) {
      const e = document.createElement("span");
      e.className = "ember";
      e.style.left = (8 + Math.random() * 84) + "%";
      e.style.setProperty("--s", (5 + Math.random() * 7).toFixed(1) + "px");
      e.style.setProperty("--d", (4 + Math.random() * 5).toFixed(1) + "s");
      e.style.setProperty("--delay", (-Math.random() * 8).toFixed(1) + "s");
      e.style.setProperty("--x", ((Math.random() - .5) * 120).toFixed(0) + "px");
      box.appendChild(e);
    }
  }
  const frame = document.querySelector(".photo-frame");
  const stage = document.querySelector(".photo-stage");
  if (frame && stage && matchMedia("(hover: hover)").matches) {
    stage.addEventListener("mousemove", ev => {
      const r = stage.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
      frame.style.setProperty("--ry", (x * 10).toFixed(2) + "deg");
      frame.style.setProperty("--rx", (-y * 10).toFixed(2) + "deg");
    });
    stage.addEventListener("mouseleave", () => { frame.style.setProperty("--rx", "0deg"); frame.style.setProperty("--ry", "0deg"); });
  }
})();

// Yaji sprinkled by hand: one moving "pinch", released in rhythmic shakes
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = document.querySelector(".yaji-fall");
  if (!box) return;
  const cv = document.createElement("canvas");
  box.appendChild(cv);
  const ctx = cv.getContext("2d");
  const colors = ["#c2501f", "#d9531e", "#e0662b", "#8c3c1b", "#a8471c", "#b8561f", "#e2b44a"];
  let W = 0, H = 0, dpr = 1, grains = [], t0 = performance.now(), lastShake = 0, running = false;

  function size() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = box.clientWidth; H = box.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Where the hand is: drifts slowly back and forth across the top
  function handX(t) { return W * (0.5 + 0.34 * Math.sin(t / 1700)) + Math.sin(t / 130) * 4; }

  function shake(t) {
    const x = handX(t), n = 22 + (Math.random() * 14 | 0);
    for (let i = 0; i < n; i++) {
      const dust = Math.random() < .35;              // fine dust floats, grains drop
      const s = dust ? 0.6 + Math.random() * 0.9 : 1 + Math.random() * 2.2;
      const ang = (Math.random() - .5) * 1.6;        // fan out from the fingers (~90° cone)
      const sp = 0.6 + Math.random() * 1.6;
      grains.push({
        x: x + (Math.random() - .5) * 26,            // spread across three fingers
        y: -4 + Math.random() * 8,
        vx: Math.sin(ang) * sp * 1.8,
        vy: Math.cos(ang) * sp * 0.6,
        drag: dust ? 0.94 : 0.975,                   // air resistance
        g: dust ? 0.012 : 0.03,                      // dust is lighter
        term: dust ? 0.7 : 2.4,                      // terminal fall speed
        ph: Math.random() * 6.28, fl: dust ? 0.5 : 0.25,  // side-to-side flutter
        s, r: Math.random() < .6,
        c: colors[(Math.random() * colors.length) | 0],
        a: dust ? .35 + Math.random() * .3 : .7 + Math.random() * .3
      });
    }
  }

  function frame(now) {
    if (!running) return;
    const t = now - t0;
    // rhythmic pinches: quick double-shake, short pause
    const beat = t % 900;
    if ((beat < 40 || (beat > 220 && beat < 260)) && now - lastShake > 120) { shake(t); lastShake = now; }

    ctx.clearRect(0, 0, W, H);
    for (const g of grains) {
      g.vy = Math.min(g.term, g.vy + g.g);      // gravity, capped by air resistance
      g.vx *= g.drag;
      g.ph += 0.06;
      g.x += g.vx + Math.sin(g.ph) * g.fl;      // flutter
      g.y += g.vy;
      const fade = g.y > H * 0.75 ? Math.max(0, 1 - (g.y - H * 0.75) / (H * 0.25)) : 1;
      ctx.globalAlpha = g.a * fade;
      ctx.fillStyle = g.c;
      if (g.r) { ctx.beginPath(); ctx.arc(g.x, g.y, g.s / 2, 0, 6.283); ctx.fill(); }
      else ctx.fillRect(g.x, g.y, g.s, g.s * 0.8);
    }
    grains = grains.filter(g => g.y < H + 5 && g.x > -20 && g.x < W + 20);
    requestAnimationFrame(frame);
  }

  size();
  addEventListener("resize", size);
  // only animate while the card is on screen
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; requestAnimationFrame(frame); }
    else if (!e.isIntersecting) running = false;
  }).observe(box);
})();
