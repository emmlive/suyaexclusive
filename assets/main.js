// ===== EDIT THESE =====
const SITE = {
  phone: "(000) 000-0000",     // shown on the page
  phoneDial: "+10000000000",   // used for tap-to-call / text (E.164 format)
  timeZone: "America/Chicago", // order days are based on this time zone
  orderDays: [6, 0, 1, 2],     // 0=Sun ... 6=Sat  → Sat, Sun, Mon, Tue
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
    ? "● Taking orders today — call now"
    : "● Orders reopen Saturday — text us anytime";
  status.classList.add(open ? "is-open" : "is-closed");
}

document.querySelectorAll(".week li").forEach(li => {
  if (Number(li.dataset.day) === today) li.classList.add("today");
});
