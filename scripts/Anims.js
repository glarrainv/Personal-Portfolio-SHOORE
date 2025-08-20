var animationFrameId;
var time = 0;
var IntervalChange;
var SlideShowInterval;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function Show(els) {
  for (var el of els) {
    document.getElementById(el).classList.remove("transp");
    document.getElementById(el).classList.add("slide-right");
    await delay(500);
  }
}

function stopAnimation() {
  if (!animationFrameId && !IntervalChange) {
    console.log("No animationFrame");
  } else {
    try {
      cancelAnimationFrame(animationFrameId);
      clearInterval(IntervalChange);
      clearInterval(SlideShowInterval);
      animationFrameId = null;
      console.log("Animation stopped.");
    } catch {}
  }
}

function animateWave(id, amplitude, frequency) {
  /* Helper Function for Calculation*/
  function calculateWavePoint(baseY, time, freq, amp, phase = 0) {
    return baseY + Math.sin(time * freq + phase) * amp;
  }

  console.log("run");
  ////Wave Variables
  const wavePath = document.querySelector(`#${id}`);
  const baseCommands = wavePath.getPathData();

  const cCommandBaseValues = baseCommands[1].values;
  const sCommandBaseValues = baseCommands[2].values;
  const initCrv1CtrlPt1_Y = cCommandBaseValues[1];
  const initCrv1CtrlPt2_Y = cCommandBaseValues[3];
  const initCrv2CtrlPt2_Y = sCommandBaseValues[1];

  if (!animationFrameId) animationFrameId = null;
  const currentCommands = JSON.parse(JSON.stringify(baseCommands));
  const currentCCommand = currentCommands[1].values;
  const currentSCommand = currentCommands[2].values;

  currentCCommand[1] = calculateWavePoint(
    initCrv1CtrlPt1_Y,
    time,
    frequency[0],
    amplitude[0]
  );
  currentCCommand[3] = calculateWavePoint(
    initCrv1CtrlPt2_Y,
    time,
    frequency[1],
    amplitude[1]
  );

  currentSCommand[1] = calculateWavePoint(
    initCrv2CtrlPt2_Y,
    time,
    frequency[2],
    amplitude[2]
  );

  time += 1;
  wavePath.setPathData(currentCommands);

  animationFrameId = requestAnimationFrame(() => {
    animateWave(id, amplitude, frequency);
  });
}
// Name Difficulty
var CurrentDiff;
function DiffIncrease() {
  //Constants
  const startw = 20;
  const barColors = ["#62d719", "#b5ef18", "#efdd18", "#ef9518", "#ef3818"];
  const barDiffs = ["easy", "medium", "hard", "impossible", "what"];
  const descDiffs = [
    `
Chilean International Student </br>
Technology Nerd </br>
20 year old </br>
    `,
    `
University of Notre Dame Sophomore </br>
Business Analytics Major </br>
Chinese & Computing and Digital Technnologies Minor </br>
    `,
    `
Data Club Event Planning Co-Director </br>
Coding 4 Good Developer </br>
Hesburgh Digital Research Award Recipient </br>`,
    `
    Badminton Club Tournament Travel Team Member </br>
    Dunne Hall Resident </br> 
    Shoore Founder </br> 
    `,
    `
    </br>
    Developer Behind 10+ Failed Projects </br> 
    </br> 
    `,
  ];
  const diffbar = document.getElementById("diffbar");
  const currentWidthStr = diffbar.style.width;

  //Get Int from String
  var currentWidth = parseInt(currentWidthStr.trimEnd("%"));
  //Current Diff checking
  if (!currentWidthStr || CurrentDiff == 1) {
    CurrentDiff = 2;
    currentWidth = startw;
  } else if (CurrentDiff == 4) {
    var nametohide = document.querySelectorAll(".hide");
    Array.from(nametohide).map((elem) => {
      elem.classList.add("transp");
    });
    CurrentDiff = 0;
    currentWidth = startw / 2;
  } else if (CurrentDiff == 0) {
    var nametohide = document.querySelector("." + barDiffs[CurrentDiff]);
    nametohide.classList.add("transp");
    CurrentDiff++;
  } else {
    CurrentDiff++;
  }
  var nametoshow = document.querySelector("." + barDiffs[CurrentDiff]);
  var label = document.querySelector("#diflabel");
  var desc = document.querySelector("#difdesc");
  label.innerHTML = barDiffs[CurrentDiff];
  desc.innerHTML = descDiffs[CurrentDiff];
  if (nametoshow) nametoshow.classList.remove("transp");
  const intervals = 10 * CurrentDiff;
  diffbar.style.backgroundColor = barColors[CurrentDiff];
  // Setting
  currentWidth += intervals;
  diffbar.style.width = `${currentWidth}%`;
}

function SquareProfile() {
  clearInterval(IntervalChange);
  var DevProfile = document.getElementById("profile");
  // DevProfile picture shake
  var frames = document.getElementsByClassName("sqr-dev");

  DevProfile.classList.remove("transp");
  DevProfile.classList.add("slide-down");

  IntervalChange = setInterval(() => {
    //Create random transformation
    for (let i = 0; i < frames.length; i++) {
      var translate = `translate3D(${RandomNum(0, 30, 3)}px, ${RandomNum(
        0,
        30,
        3
      )}px, ${RandomNum(0, 30, 3)}px)`;
      // APply random transformation
      frames[i].style["transform"] = translate;
    }
  }, 1000);
}
function RandomNum(max, min, dec) {
  return Math.round(Math.random() * (max - min), dec) + min;
}

//Vertical Slideshow
