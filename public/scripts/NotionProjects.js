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
    companies: (data.Companies || data.companies || []).map(mapCompany),
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

function mapCompany(entry) {
  return {
    id: entry.id || "",
    name: String(entry.Company || "").trim(),
    logo: (entry.Logo || [])[0] || "",
    rawColors: entry.Colorscheme,
    colors: asArray(entry.Colorscheme).map(themeColor),
    projectIds: (entry.Projects || []).map(relationId).filter(Boolean),
  };
}

function relationId(relation) {
  if (typeof relation === "string") return relation;
  if (relation && typeof relation === "object") return relation.id || "";
  return "";
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // A non-JSON string can still be a comma-separated color list.
  }

  return value.split(",");
}

function themeColor(value) {
  if (typeof value !== "string") return "";
  const color = value.trim();
  if (color.toLocaleLowerCase() === "default") return "default";
  return CSS.supports("color", color) ? color : "";
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

function getCompanyFromUrl(companies) {
  const requestedCompany = new URLSearchParams(window.location.search)
    .get("company")
    ?.trim()
    .toLocaleLowerCase();

  if (!requestedCompany) return null;
  return (
    companies.find(
      (company) => company.name.toLocaleLowerCase() === requestedCompany,
    ) || null
  );
}

function companyProjects(company, projects) {
  const companyProjectReferences = new Set(
    company.projectIds.map(projectReference).filter(Boolean),
  );
  return projects.filter(
    (project) =>
      companyProjectReferences.has(projectReference(project.id)) ||
      companyProjectReferences.has(projectReference(project.title)),
  );
}

function projectReference(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase();
}

const DEFAULT_THEME = {
  primary: "#5695c0",
  secondary: "#fffbde",
  darkText: "#0a0909",
  lightText: "#fff",
  light: "#fbfcfc",
  dark: "#2c6995",
};

function themeValue(value, fallback) {
  return !value || value === "default" ? fallback : value;
}

function companyTheme(colors = []) {
  const [
    primaryColor,
    secondaryColor,
    darkTextColor,
    lightTextColor,
    lightColor,
    darkColor,
  ] = colors;
  const primary = themeValue(primaryColor, DEFAULT_THEME.primary);
  const secondary = themeValue(secondaryColor, DEFAULT_THEME.secondary);

  return {
    primary,
    secondary,
    darkText: themeValue(darkTextColor, DEFAULT_THEME.darkText),
    lightText: themeValue(lightTextColor, DEFAULT_THEME.lightText),
    light: themeValue(lightColor, DEFAULT_THEME.light),
    dark: themeValue(darkColor, DEFAULT_THEME.dark),
  };
}

function themeWipeElement() {
  let wipe = document.getElementById("company-theme-wipe");
  if (wipe) return wipe;

  wipe = document.createElement("div");
  wipe.id = "company-theme-wipe";
  wipe.className = "company-theme-wipe";
  wipe.setAttribute("aria-hidden", "true");
  document.body.appendChild(wipe);
  return wipe;
}

function setThemeVariables(theme) {
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty("--primary", theme.primary);
  rootStyle.setProperty("--secondary", theme.secondary);
  rootStyle.setProperty("--dark-text", theme.darkText);
  rootStyle.setProperty("--light-text", theme.lightText);
  rootStyle.setProperty("--light", theme.light);
  rootStyle.setProperty("--dark", theme.dark);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme.primary);
}

function applyCompanyTheme(colors) {
  const theme = companyTheme(colors);

  const wipe = themeWipeElement();
  wipe.style.setProperty("--company-wipe-primary", theme.primary);
  wipe.style.setProperty("--company-wipe-secondary", theme.secondary);
  document.body.classList.add("company-theme-transition");
  void wipe.offsetWidth;
  wipe.classList.add("is-running");

  window.setTimeout(() => setThemeVariables(theme), 520);
  window.setTimeout(() => {
    wipe.classList.remove("is-running");
    document.body.classList.remove("company-theme-transition");
  }, 1400);

  return theme;
}

function renderCompanyHero(company) {
  const hero = document.getElementById("company-hero");
  const logo = document.getElementById("company-logo");
  const scrollButton = document.getElementById("company-scroll");
  if (!hero || !logo || !scrollButton || !company.logo) return;

  logo.src = company.logo;
  logo.alt = `${company.name} logo`;
  hero.classList.remove("d-none");

  logo.addEventListener("error", () => hero.classList.add("d-none"), {
    once: true,
  });
  scrollButton.addEventListener("click", () => {
    document.getElementById("Content")?.scrollIntoView({ behavior: "smooth" });
  });
  window.setTimeout(() => scrollButton.classList.add("is-visible"), 3000);
}

function applyCompanyCustomization(company, projects) {
  const theme = applyCompanyTheme(company.colors);
  renderCompanyHero(company);
  const matchedProjects = companyProjects(company, projects);
  console.info("Company customization applied", {
    company: company.name,
    rawColorscheme: company.rawColors,
    normalizedColorscheme: company.colors,
    resolvedTheme: theme,
    projectReferences: company.projectIds,
    matchedProjects: matchedProjects.map((project) => ({
      id: project.id,
      title: project.title,
    })),
  });
  return matchedProjects;
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

function chipRow(tools) {
  const row = document.createElement("div");
  row.className = "project-tools chips";
  tools.slice(0, 3).forEach((tool) => {
    const chip = document.createElement("span");
    chip.className = "chip pill";
    chip.textContent = tool;
    row.appendChild(chip);
  });

  if (tools.length > 3) {
    const more = document.createElement("span");
    more.className = "project-more-tools";
    more.textContent = `+${tools.length - 3} tools`;
    row.appendChild(more);
  }

  return row;
}

/* Complete projects — pebbles washed up on the shore */
function projectLink(url) {
  const value = String(url || "").trim();
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function projectMedia(project) {
  const media = document.createElement("div");
  media.className = "project-media";

  if (project.image) {
    const img = document.createElement("img");
    img.className = "project-media-img";
    img.src = project.image;
    img.alt = project.title ? `${project.title} preview` : "Project preview";
    media.appendChild(img);
  } else {
    const fallback = document.createElement("span");
    fallback.className = "project-media-fallback";
    fallback.textContent = (project.title || "Project")
      .slice(0, 2)
      .toUpperCase();
    media.appendChild(fallback);
  }

  return media;
}

function projectCta(url) {
  const href = projectLink(url);
  if (!href) return null;

  const link = document.createElement("a");
  link.className = "project-cta";
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "View here";
  return link;
}

function projectCardElement(project) {
  const el = document.createElement("article");
  el.className = "project-card";
  el.appendChild(projectMedia(project));

  const content = document.createElement("div");
  content.className = "project-content";

  const title = document.createElement("h4");
  title.className = "project-title";
  title.textContent = project.title || "Untitled Project";
  content.appendChild(title);

  if (project.description) {
    const desc = document.createElement("p");
    desc.className = "project-desc";
    desc.textContent = project.description;
    content.appendChild(desc);
  }

  if (project.tools.length) content.appendChild(chipRow(project.tools));

  const footer = document.createElement("div");
  footer.className = "project-footer";
  const date = document.createElement("span");
  date.className = "project-date pill";
  date.textContent = formatRange(project);
  footer.appendChild(date);

  const cta = projectCta(project.projectLink);
  if (cta) footer.appendChild(cta);
  content.appendChild(footer);
  el.appendChild(content);
  return el;
}

/* Current projects — floats still out at sea */
function applyProjectCardTheme(card, index) {
  card.classList.add(index % 2 ? "darkbg" : "lightbg");
  card.classList.add(index % 2 ? "l-text" : "text");
  if (index === 0) card.classList.add("is-featured");
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
    .forEach((project, index) => {
      const card = projectCardElement(project);
      applyProjectCardTheme(card, index);
      doneContainer.appendChild(card);
    });

  projects
    .filter((project) => project.status === "In progress")
    .sort((a, b) => b.start.localeCompare(a.start))
    .forEach((project, index) => {
      const card = projectCardElement(project);
      applyProjectCardTheme(card, index);
      progressContainer.appendChild(card);
    });
}

/* Website Loading Display */
export async function initPortfolio() {
  let data;
  try {
    console.log("Fetching portfolio data from worker...");
    data = await fetchPortfolioData();
    console.log(
      `Found ${data.projects.length} projects, ${data.experiences.length} experiences, and ${data.companies.length} companies.`,
    );
  } catch (error) {
    console.error("Failed to load portfolio data:", error);
    console.log("Using fallback static content");
    data = {
      projects: getFallbackProjects(),
      experiences: getFallbackExperiences(),
      companies: [],
    };
  }

  /* Hand experiences to Anims.js (difficulty bar pills) */
  window.EXPERIENCES = data.experiences;
  document.dispatchEvent(new CustomEvent("experiences-ready"));

  const selectedCompany = getCompanyFromUrl(data.companies);
  const projects = selectedCompany
    ? applyCompanyCustomization(selectedCompany, data.projects)
    : data.projects;
  renderProjects(projects);
}

/* Event Listener */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortfolio);
} else {
  initPortfolio();
}
