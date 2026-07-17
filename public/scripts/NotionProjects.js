/* Portfolio data fetching from the Notion Cloudflare worker */
const WORKER_URL = "https://notion-proxy.glarrain.workers.dev";

async function fetchPortfolioData() {
  const response = await fetch(WORKER_URL);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return {
    projects: (data.Projects || []).map(mapProject),
    experiences: (data.Experiences || []).map(mapExperience),
  };
}

/* Worker payload -> flat shapes the renderers consume */
function mapProject(page) {
  const date = page["Date Range"] || {};
  return {
    id: page.id,
    title: page.Name || "",
    description: page["Project Description"] || "",
    status: page.Status || "",
    projectLink: page["Project Link"] || "",
    start: date.start || "",
    end: date.end || "",
    tools: page.Tools || [],
    image: (page.Image || [])[0] || "",
  };
}

function mapExperience(entry) {
  return {
    role: entry.Role || "",
    company: entry.Company || "",
    status: entry.Status || "",
    priority: entry.Priority || "",
  };
}

/* Safety fallbacks (mirror the worker shapes) */
function getFallbackProjects() {
  return [
    {
      id: "redreport",
      title: "RedReport",
      description:
        '"Believing in your own story carries no shame" — a tool for Notre Dame students to anonymously report aggressions',
      status: "In progress",
      projectLink: "https://reddot.report",
      start: "2025-02-01",
      end: "",
      tools: ["Typescript", "React", "CSS", "R"],
      image: "",
    },
    {
      id: "truelens",
      title: "TrueLens",
      description:
        "GPT-OSS powered search agent for finding human art across the web",
      status: "Done",
      projectLink: "https://github.com/TrueLensAI/openai-hackathon",
      start: "2025-08-12",
      end: "2025-09-11",
      tools: ["React", "LangChain", "GPT-OSS", "FastAPI", "Python"],
      image: "",
    },
    {
      id: "translation",
      title: "Translation Assistant",
      description:
        "An LLM-powered tool that breaks down the translation process from Chinese to English",
      status: "Done",
      projectLink: "https://github.com/glarrainv/TranslationAssistant",
      start: "2025-05-22",
      end: "2025-07-12",
      tools: ["Prompt Engineering", "HTML", "CSS", "OpenRouter"],
      image: "",
    },
    {
      id: "statsgame",
      title: "Statistics Game",
      description:
        "A statistics game built with Notre Dame Professor Jay Brockman for the local Robinson Community Center",
      status: "Done",
      projectLink: "https://github.com/slayer1371/cs4good-beanbag",
      start: "2024-09-01",
      end: "2025-05-01",
      tools: ["React", "Typescript", "MongoDB", "HTML", "CSS"],
      image: "",
    },
  ];
}

function getFallbackExperiences() {
  return [
    {
      role: "Co-President",
      company: "Data Club of Notre Dame",
      status: "Active",
      priority: "High",
    },
    {
      role: "SWE Intern",
      company: "Beijing Facilitator",
      status: "Completed",
      priority: "High",
    },
    {
      role: "Founder",
      company: "RedReport",
      status: "Active",
      priority: "Medium",
    },
  ];
}

/* Date presentation */
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatMonth(iso) {
  if (!iso) return "";
  const [year, month] = iso.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

function formatRange(project) {
  const start = formatMonth(project.start);
  const end = formatMonth(project.end);
  if (project.status === "In progress") {
    return start ? `since ${start}` : "ongoing";
  }
  if (start && end) return start === end ? start : `${start} – ${end}`;
  return start;
}

/* Shared render helpers */
function makeLink(el, url) {
  if (!url) return;
  el.classList.add("is-link");
  el.setAttribute("role", "link");
  el.tabIndex = 0;
  const go = () => window.open(url, "_blank");
  el.addEventListener("click", go);
  el.addEventListener("keydown", (event) => {
    if (event.key === "Enter") go();
  });
}

function chipRow(tools) {
  const row = document.createElement("div");
  row.className = "chips";
  tools.forEach((tool) => {
    const chip = document.createElement("span");
    chip.className = "chip pill";
    chip.textContent = tool;
    row.appendChild(chip);
  });
  return row;
}

/* Complete projects — pebbles washed up on the shore */
function pebbleElement(project) {
  const el = document.createElement("article");
  el.className = "pebble text";

  const title = document.createElement("h4");
  title.className = "pebble-title";
  title.textContent = project.title || "Untitled Project";
  el.appendChild(title);

  if (project.description) {
    const desc = document.createElement("p");
    desc.className = "pebble-desc";
    desc.textContent = project.description;
    el.appendChild(desc);
  }

  if (project.tools.length) el.appendChild(chipRow(project.tools));

  const date = document.createElement("span");
  date.className = "pebble-date";
  date.textContent = formatRange(project);
  el.appendChild(date);

  makeLink(el, project.projectLink);
  return el;
}

/* Current projects — floats still out at sea */
function floatElement(project) {
  const el = document.createElement("article");
  el.className = "float";

  if (project.image) {
    el.classList.add("has-media");
    const media = document.createElement("div");
    media.className = "float-media";
    media.style.backgroundImage = `url('${project.image}')`;
    el.appendChild(media);
  } else {
    const title = document.createElement("h4");
    title.className = "float-title";
    title.textContent = project.title || "Untitled Project";
    el.appendChild(title);
  }

  if (project.description) {
    const desc = document.createElement("p");
    desc.className = "float-desc";
    desc.textContent = project.description;
    el.appendChild(desc);
  }

  if (project.tools.length) el.appendChild(chipRow(project.tools));

  const status = document.createElement("span");
  status.className = "float-status";
  status.textContent = `In progress · ${formatRange(project)}`;
  el.appendChild(status);

  makeLink(el, project.projectLink);
  return el;
}

/* HTML Project rendering */
function renderProjects(projects) {
  const doneContainer = document.querySelector("#Projects .grid");
  const progressContainer = document.querySelector("#Progress .grid");

  if (!doneContainer || !progressContainer) {
    console.error("Could not find project containers");
    return;
  }
  doneContainer.innerHTML = "";
  progressContainer.innerHTML = "";

  const newestFirst = (a, b) =>
    (b.end || b.start).localeCompare(a.end || a.start);

  projects
    .filter((project) => project.status === "Done")
    .sort(newestFirst)
    .forEach((project) => doneContainer.appendChild(pebbleElement(project)));

  projects
    .filter((project) => project.status === "In progress")
    .sort((a, b) => b.start.localeCompare(a.start))
    .forEach((project) => progressContainer.appendChild(floatElement(project)));
}

/* Website Loading Display */
export async function initPortfolio() {
  let data;
  try {
    console.log("Fetching portfolio data from worker...");
    data = await fetchPortfolioData();
    console.log(
      `Found ${data.projects.length} projects, ${data.experiences.length} experiences.`,
    );
  } catch (error) {
    console.error("Failed to load portfolio data:", error);
    console.log("Using fallback static content");
    data = {
      projects: getFallbackProjects(),
      experiences: getFallbackExperiences(),
    };
  }

  /* Hand experiences to Anims.js (difficulty bar pills) */
  window.EXPERIENCES = data.experiences;
  document.dispatchEvent(new CustomEvent("experiences-ready"));

  renderProjects(data.projects);
}

/* Event Listener */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortfolio);
} else {
  initPortfolio();
}
