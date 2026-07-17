var animationFrameId;
var time = 0;

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
  if (!animationFrameId) {
    console.log("No animationFrame");
  } else {
    try {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      console.log("Animation stopped.");
    } catch {
      // Frame already released; nothing left to cancel.
    }
  }
}

function animateWave(id, amplitude, frequency) {
  /* Helper Function for Calculation*/
  function calculateWavePoint(baseY, time, freq, amp, phase = 0) {
    return baseY + Math.sin(time * freq + phase) * amp;
  }

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
    amplitude[0],
  );
  currentCCommand[3] = calculateWavePoint(
    initCrv1CtrlPt2_Y,
    time,
    frequency[1],
    amplitude[1],
  );

  currentSCommand[1] = calculateWavePoint(
    initCrv2CtrlPt2_Y,
    time,
    frequency[2],
    amplitude[2],
  );

  time += 1;
  wavePath.setPathData(currentCommands);

  animationFrameId = requestAnimationFrame(() => {
    animateWave(id, amplitude, frequency);
  });
}

// Name Difficulty
var CurrentDiff = 1;

function animateClickHint() {
  const hint = document.getElementById("clickhint");
  if (hint) {
    hint.classList.add("click-animation");
  }
}

function stopClickHintAnimation() {
  const hint = document.getElementById("clickhint");
  if (hint) {
    hint.classList.remove("click-animation");
  }
}

/* Difficulty ladder — brand palette, shallow to deep water */
const barColors = [
  "var(--paleblue)",
  "var(--lightblue)",
  "var(--grayblue)",
  "var(--steel)",
  "var(--darkblue)",
];
const barDiffs = ["Easy", "Medium", "Hard", "Impossible", "WHAT"];
const pillPalette = ["lightyellowbg", "whitebg", "palebluebg"];

/* Split all experiences into 5 sequential groups; remainders fill earlier groups first */
function experienceGroups(experiences) {
  const groups = [];
  const base = Math.floor(experiences.length / 5);
  const remainder = experiences.length % 5;
  let index = 0;
  for (let g = 0; g < 5; g++) {
    const size = base + (g < remainder ? 1 : 0);
    groups.push(experiences.slice(index, index + size));
    index += size;
  }
  return groups;
}

/* Experience pills from the Cloudflare worker (set by NotionProjects.js) */
/* One unique group per difficulty level */
let statusls = {};
function renderExperiences() {
  const box = document.getElementById("expbox");
  const experiences = window.EXPERIENCES;
  if (!box || !experiences) return;

  const shown = experienceGroups(experiences)[CurrentDiff] || [];

  box.innerHTML = "";
  shown.forEach((exp, i) => {
    if (!statusls[exp.status]) {
      const bg =
        pillPalette[Object.values(statusls).length % (pillPalette.length + 1)];
      console.log("New status found:", exp.status, ", Color: ", bg);
      statusls[exp.status] = bg;
    }
    const pill = document.createElement("div");
    pill.className = `exp-pill fade-in pill ${statusls[exp.status]}`;
    pill.style.animationDelay = `${i * 60}ms`;

    const role = document.createElement("strong");
    role.className = "exp-role";
    role.textContent = exp.role;
    pill.appendChild(role);

    if (exp.company && exp.company !== "N/A") {
      const company = document.createElement("span");
      company.className = "exp-co";
      company.textContent = exp.company;
      pill.appendChild(company);
    }

    const status = document.createElement("em");
    status.className = "exp-status";
    status.textContent = exp.status;
    pill.appendChild(status);

    box.appendChild(pill);
  });
}
document.addEventListener("experiences-ready", renderExperiences);

function DiffIncrease() {
  //Constants
  const startw = 20;
  const diffbar = document.getElementById("diffbar");
  const currentWidthStr = diffbar.style.width;

  //Get Int from String
  var currentWidth = parseInt(currentWidthStr);
  //Current Diff checking
  if (!currentWidthStr || CurrentDiff == 1) {
    CurrentDiff = 2;
    currentWidth = startw;
  } else if (CurrentDiff == 4) {
    const nametohide = document.querySelectorAll(".hide");
    Array.from(nametohide).forEach((elem) => {
      elem.classList.add("transp");
    });
    CurrentDiff = 0;
    currentWidth = startw / 2;
  } else if (CurrentDiff == 0) {
    const nametohide = document.querySelector("." + barDiffs[CurrentDiff]);
    nametohide.classList.add("transp");
    CurrentDiff++;
  } else {
    CurrentDiff++;
  }
  var nametoshow = document.querySelector("." + barDiffs[CurrentDiff]);
  var label = document.querySelector("#diflabel");
  label.innerHTML = "Name Difficulty: " + barDiffs[CurrentDiff];
  if (nametoshow) nametoshow.classList.remove("transp");
  const intervals = 10 * CurrentDiff;
  diffbar.style.backgroundColor = barColors[CurrentDiff];
  // Setting
  currentWidth += intervals;
  diffbar.style.width = `${currentWidth}%`;

  renderExperiences();
}

function RandomNum(max, min, dec) {
  return Math.round(Math.random() * (max - min), dec) + min;
}
function ScrollIntoView(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

function createGust() {
  const windContainer = document.getElementById("Page");
  const gust = document.createElement("div");
  gust.className = "wind-gust";

  const yPosition = Math.random() * window.innerHeight;
  const width = Math.random() * 150 + 50;
  const height = Math.random() * 2 + 5;
  const opacity = Math.random() * 0.5 + 0.1;
  const duration = Math.random() * 8 + 5;

  gust.style.top = `${yPosition}px`;
  gust.style.width = `${width}px`;
  gust.style.height = `${height}px`;
  gust.style.opacity = opacity;
  gust.style.animationDuration = `${duration}s`;

  windContainer.appendChild(gust);

  gust.addEventListener("animationend", () => {
    gust.remove();
  });
}
