/* Project fetching from Notion */
async function fetchProjectsFromBackend() {
  try {
    const response = await fetch("https://notion-proxy.glarrain.workers.dev");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const projects = await response.json();
    return projects;
  } catch (error) {
    console.error("Error fetching projects from backend:", error);
    throw error;
  }
}

/* Project safety fallback*/
function getFallbackProjects() {
  return [
    {
      id: "redreport",
      title: "Redreport",
      description:
        '"Believing in your own story carries no shame" - A tool for Notre Dame students to anonymously report aggressions',
      status: "Done",
      projectLink: "https://reddot.report",
      dateRange: "2025-02-01",
      tools: ["Typescript", "React", "CSS", "R"],
    },
    {
      id: "cs4good",
      title: "Statistic Game for Kids",
      description:
        "A dashboard built for Professor Brockman from the University of Notre Dame to teach elementary kids basic statistics",
      status: "Done",
      projectLink: "https://github.com/slayer1371/cs4good-beanbag",
      dateRange: "2024-09-01 to 2024-12-11",
      tools: ["React", "JS", "MongoDB", "HTML", "CSS"],
    },
    {
      id: "translation",
      title: "LLM Chinese to English Translation Assistant",
      description:
        "A Qwen3-powered translation tool that breaks down the meaning behind the English translation in Chinese",
      status: "In progress",
      projectLink: "https://github.com/glarrainv/TranslationAssistant",
      dateRange: "2025-06-20 to present",
      tools: ["Prompt Engineering", "HTML", "CSS", "JS", "OpenRouterAPI"],
    },
  ];
}

/* HTML Project Card rendering*/
function renderProjects(projects) {
  const projectsContainer = document.querySelector("#Projects .grid");

  if (!projectsContainer) {
    console.error("Could not find projects container");
    return;
  }

  /* Safety Clear */
  projectsContainer.innerHTML = "";

  /* Completed Projects */
  const filteredProjects = projects.filter(
    (project) => project.status == "Done"
  );

  /* Element Creation */
  filteredProjects.forEach((project) => {
    const projectElement = document.createElement("div");
    projectElement.className = "project-card lightyellowbg shade";
    projectElement.onclick = () => {
      if (project.projectLink) {
        window.open(project.projectLink, "_blank");
      }
    };

    const toolsString = project.tools ? project.tools.join(", ") : "";

    projectElement.innerHTML = `
      <div class="text z-2 pos-rel slide-right" style="width: 100%;">
        <h2 class="sm">${project.title || "Untitled Project"}</h2>
        <h4 class="xs fw-light m-0"><i>${project.description || ""}</i></h4>
        <h6 class="m-1">${toolsString}</h6>
        <div class="project-details">
          <div class="status m-1"><small>Status: ${
            project.status || ""
          }</small></div>
          <div class=" date m-0"><small>Date Range: ${
            project.dateRange || ""
          }</small></div>
        </div>
      </div>
    `;

    projectsContainer.appendChild(projectElement);
  });
}

/* Website Loading Display */
export async function initProjects() {
  try {
    console.log("Fetching projects from backend...");
    const projects = await fetchProjectsFromBackend();
    console.log(`Found ${projects.length} projects.`);
    renderProjects(projects);
  } catch (error) {
    console.error("Failed to load projects from backend:", error);
    console.log("Using fallback static content");
    renderProjects(getFallbackProjects());
  }
}

/* Event Listener */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProjects);
} else {
  initProjects();
}
