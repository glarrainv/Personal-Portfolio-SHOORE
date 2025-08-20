if ("onscrollend" in window) {
  window.addEventListener("scrollend", Snap);
} else {
  let scrollEndTimer;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(Snap, 200);
  });
}
let vh;
let vw;
function setViewportHeight() {
  if (window.innerWidth <= 600) {
    vh = window.innerHeight + 80;
    vw = window.innerWidth - 40;
  } else {
    vh = window.innerHeight;
    vw = window.innerWidth / 2 - 20;
  }
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  document.documentElement.style.setProperty("--vw", `${vw}px`);
}
setViewportHeight();
window.addEventListener("orientationchange", setViewportHeight);
