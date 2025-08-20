// On Scroll

function Snap() {
  const currentScrollY = window.scrollY;
  const windowSize = window.innerHeight;

  console.log(currentScrollY / windowSize);
  const currentSlide = Math.round(currentScrollY / windowSize, 0);
  console.log(currentSlide);
  const Sections = ["Page", "Content", "Project"];
  stopAnimation();

  if (currentSlide == 0) {
    animateWave("wave", [0.49, 0.65, 0.99], [0.03, 0.04, 0.01]);
  } else if (currentSlide == 1) {
    animateWave("wave2", [0.4, 0.45, 0.38], [0.005, 0.004, 0.006]);
    SquareProfile();
  }
}

//// Random Number
