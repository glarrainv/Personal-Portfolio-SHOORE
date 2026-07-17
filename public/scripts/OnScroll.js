// On Scroll

function Snap() {
  const currentScrollY = window.scrollY;
  const windowSize = window.innerHeight;

  console.log(currentScrollY / windowSize);
  const currentSlide = Math.round(currentScrollY / windowSize, 0);
  console.log(currentSlide);
  stopAnimation();

  if (currentSlide == 0) {
    animateWave("wave", [0.49, 0.65, 0.99], [0.03, 0.04, 0.01]);
    stopClickHintAnimation();
  } else if (currentSlide == 1) {
    animateWave("wave2", [1.5, 1.5, -2], [0.015, 0.02, 0.02]);
    animateClickHint();
  } else {
    stopClickHintAnimation();
  }
}

//// Random Number
