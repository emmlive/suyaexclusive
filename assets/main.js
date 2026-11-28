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
    for (let i = 0; i < 26; i++) {
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
