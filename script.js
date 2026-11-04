const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const projectGrid = document.getElementById("projectGrid");
const projectsStatus = document.getElementById("projectsStatus");
const projectsToggle = document.getElementById("projectsToggle");
const contactSuccessUrl = document.getElementById("contactSuccessUrl");
const themePicker = document.getElementById("themePicker");
const initialProjectCount = 3;
const featuredRepositories = [
  "AnyData-Analyzer",
  "Automated-Web-Scraping-Power-BI-Integration",
  "Automating-Reporting"
];
const themeStorageKey = "portfolio-accent-theme";
const knownPublicRepositories = [
  "Automated-Web-Scraping-Power-BI-Integration",
  "AnyData-Analyzer",
  "Automating-Reporting",
  "Comparison-Files",
  "Customer-Segmentation-Visualization-Advanced-Analysis",
  "Hospitality-Emergency-Room-Dashboard",
  "MySQL_Data_Pipeline_Analysis",
  "IPL-Data-Analysis-2008---2024-",
  "E-Commerce-Business-Insights",
  "customer-purchase-behaviour-Analysis",
  "Ola-",
  "hostipal-emergency-dashboard",
  "Sales-Marketing",
  "Decarbonization-Developers_042"
].map(name => ({
  name,
  full_name: "gauravlakshakar/" + name,
  html_url: "https://github.com/gauravlakshakar/" + name,
  description: "",
  language: "",
  stargazers_count: 0,
  updated_at: ""
}));

toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

function closeMobileNav() {
  nav?.classList.remove("open");
  toggle?.setAttribute("aria-expanded", "false");
}

function applyTheme(theme) {
  const allowedThemes = ["mint", "ocean", "violet", "amber"];
  const selectedTheme = allowedThemes.includes(theme) ? theme : "mint";
  document.body.dataset.theme = selectedTheme;
  if (themePicker) themePicker.value = selectedTheme;
}

try {
  applyTheme(localStorage.getItem(themeStorageKey) || "mint");
} catch (error) {
  console.error("Could not read the saved portfolio theme.", error);
  applyTheme("mint");
}

themePicker?.addEventListener("change", () => {
  applyTheme(themePicker.value);
  try {
    localStorage.setItem(themeStorageKey, themePicker.value);
  } catch (error) {
    console.error("Could not save the selected portfolio theme.", error);
  }
});

function cleanMarkdown(text) {
  return text
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/[`*_~]/g, "")
    .replace(/^\s{0,3}#{1,6}\s*/, "")
    .replace(/^\s{0,3}>\s?/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readmeOverview(readme) {
  const lines = readme.split(/\r?\n/);
  let paragraph = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || /^```/.test(trimmed)) {
      if (paragraph.length) break;
      continue;
    }
    if (/^#{1,6}\s/.test(trimmed) || /^[-*_]{3,}$/.test(trimmed) ||
        /^!\[/.test(trimmed) || /^<img\b/i.test(trimmed)) {
      continue;
    }
    paragraph.push(trimmed);
  }

  return cleanMarkdown(paragraph.join(" ")).slice(0, 360);
}

function appendReadmeContent(container, readme) {
  const lines = readme.slice(0, 40000).split(/\r?\n/);
  let paragraph = [];
  let list = null;
  let code = null;

  function flushParagraph() {
    if (!paragraph.length) return;
    const element = document.createElement("p");
    element.textContent = cleanMarkdown(paragraph.join(" "));
    if (element.textContent) container.append(element);
    paragraph = [];
  }

  function closeList() {
    list = null;
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^```/.test(trimmed)) {
      flushParagraph();
      closeList();
      if (code) {
        const pre = document.createElement("pre");
        pre.textContent = code.join("\n");
        container.append(pre);
        code = null;
      } else {
        code = [];
      }
      continue;
    }
    if (code) {
      code.push(line);
      continue;
    }
    if (!trimmed) {
      flushParagraph();
      closeList();
      continue;
    }
    if (/^#{1,3}\s/.test(trimmed)) {
      flushParagraph();
      closeList();
      const heading = document.createElement("h3");
      heading.textContent = cleanMarkdown(trimmed);
      container.append(heading);
      continue;
    }
    const item = trimmed.match(/^[-*+]\s+(.+)/);
    if (item) {
      flushParagraph();
      if (!list) {
        list = document.createElement("ul");
        container.append(list);
      }
      const listItem = document.createElement("li");
      listItem.textContent = cleanMarkdown(item[1]);
      list.append(listItem);
      continue;
    }
    if (/^[-*_]{3,}$/.test(trimmed) || /^!\[/.test(trimmed) || /^<img\b/i.test(trimmed)) {
      continue;
    }
    closeList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  if (code) {
    const pre = document.createElement("pre");
    pre.textContent = code.join("\n");
    container.append(pre);
  }
}

function createProjectCard(repo, readme) {
  const summary = readmeOverview(readme?.content || "");
  const card = document.createElement("article");
  card.className = "project-card github-project is-visible";

  const visual = document.createElement("div");
  visual.className = "project-visual";
  const visualTop = document.createElement("div");
  visualTop.className = "visual-top";
  const repoLabel = document.createElement("span");
  repoLabel.textContent = repo.full_name;
  const languageLabel = document.createElement("span");
  languageLabel.textContent = repo.language || "GITHUB REPOSITORY";
  visualTop.append(repoLabel, languageLabel);
  visual.append(visualTop);

  const info = document.createElement("div");
  info.className = "project-info";
  const name = document.createElement("h3");
  name.textContent = repo.name;
  info.append(name);

  const description = document.createElement("p");
  description.className = "repo-description";
  description.textContent = repo.description || summary || "Public repository on GitHub.";

  const overview = document.createElement("p");
  overview.className = "github-project-summary";
  overview.textContent = summary
    ? "README · " + summary
    : "Add a README.md to this GitHub repository to show its project overview here.";

  const tags = document.createElement("div");
  tags.className = "tag-row";
  const stars = document.createElement("span");
  stars.textContent = "★ " + (repo.stargazers_count || 0) + " stars";
  tags.append(stars);
  if (repo.forks_count !== undefined) {
    const forks = document.createElement("span");
    forks.textContent = "⑂ " + repo.forks_count + " forks";
    tags.append(forks);
  }
  if (repo.license?.name) {
    const license = document.createElement("span");
    license.textContent = repo.license.name;
    tags.append(license);
  }
  if (repo.updated_at) {
    const updated = document.createElement("span");
    updated.textContent = "Updated " + new Date(repo.updated_at).toLocaleDateString();
    tags.append(updated);
  }
  for (const topic of (repo.topics || []).slice(0, 4)) {
    const topicTag = document.createElement("span");
    topicTag.textContent = topic;
    tags.append(topicTag);
  }

  const readmeButton = document.createElement("button");
  readmeButton.type = "button";
  readmeButton.className = "project-link project-link-button";
  readmeButton.setAttribute("aria-expanded", "false");
  readmeButton.textContent = "Show repository README +";

  const readmePanel = document.createElement("div");
  readmePanel.className = "readme-inline";
  readmePanel.hidden = true;
  if (readme?.content) {
    appendReadmeContent(readmePanel, readme.content);
  } else {
    const empty = document.createElement("p");
    empty.className = "readme-empty";
    empty.textContent = readme?.status === "missing"
      ? "This repository does not have a README yet. Add a README.md in GitHub and it will appear here."
      : "The README could not be loaded right now. Refresh the page to try again.";
    readmePanel.append(empty);
  }

  readmeButton.addEventListener("click", () => {
    const expanded = readmeButton.getAttribute("aria-expanded") === "true";
    readmeButton.setAttribute("aria-expanded", String(!expanded));
    readmeButton.textContent = expanded ? "Show repository README +" : "Hide repository README −";
    readmePanel.hidden = expanded;
  });

  const actions = document.createElement("div");
  actions.className = "project-actions";
  actions.append(readmeButton);

  if (repo.html_url) {
    const repositoryLink = document.createElement("a");
    repositoryLink.className = "project-link";
    repositoryLink.href = repo.html_url;
    repositoryLink.target = "_blank";
    repositoryLink.rel = "noreferrer";
    repositoryLink.textContent = "Open repository ↗";
    actions.append(repositoryLink);
  }

  card.append(visual, info, description, overview, tags, actions, readmePanel);
  return card;
}

async function fetchReadme(repo) {
  const filenames = ["README.md", "readme.md", "README.MD", "readme.MD"];
  for (const filename of filenames) {
    const url = "https://raw.githubusercontent.com/" + repo.full_name + "/HEAD/" + filename;
    const response = await fetch(url, {cache: "no-store"});
    if (response.status === 404) continue;
    if (!response.ok) {
      throw new Error("GitHub README request failed for " + repo.full_name + ": HTTP " + response.status);
    }
    return {content: await response.text(), status: "loaded"};
  }
  return {content: "", status: "missing"};
}

async function loadGithubProjects() {
  let repositories;
  let usingFallback = false;
  try {
    const response = await fetch(
      "https://api.github.com/users/gauravlakshakar/repos?sort=updated&per_page=100",
      {cache: "no-store"}
    );
    if (!response.ok) throw new Error("GitHub repository request failed: HTTP " + response.status);

    repositories = (await response.json())
      .filter(repo => !repo.fork && repo.name.toLowerCase() !== "gauravlakshakar")
      .sort((a, b) => {
        const aFeatured = featuredRepositories.indexOf(a.name);
        const bFeatured = featuredRepositories.indexOf(b.name);
        if (aFeatured !== -1 || bFeatured !== -1) {
          if (aFeatured === -1) return 1;
          if (bFeatured === -1) return -1;
          return aFeatured - bFeatured;
        }
        return new Date(b.updated_at) - new Date(a.updated_at);
      });
  } catch (error) {
    console.error("Could not load GitHub projects.", error);
    repositories = knownPublicRepositories;
    usingFallback = true;
  }

  if (!repositories.length) {
    projectGrid.replaceChildren();
    projectsStatus.textContent = "No public project repositories were found on GitHub.";
    return;
  }

  const results = await Promise.allSettled(repositories.map(fetchReadme));
  let readmeFailures = 0;
  const cards = repositories.map((repo, index) => {
    const result = results[index];
    let readme = {content: "", status: "unavailable"};
    if (result.status === "fulfilled") {
      readme = result.value;
    } else {
      readmeFailures++;
      console.error(result.reason);
    }
    const card = createProjectCard(repo, readme);
    card.hidden = index >= initialProjectCount;
    return card;
  });

  projectGrid.replaceChildren(...cards);
  projectsToggle.hidden = cards.length <= initialProjectCount;
  projectsToggle.setAttribute("aria-expanded", "false");
  projectsToggle.innerHTML = 'See more <span>↓</span>';
  const source = usingFallback
    ? "Showing a saved list of public repositories because GitHub's repository API is unavailable."
    : "Showing " + repositories.length + " public repositories.";
  projectsStatus.textContent = readmeFailures
    ? source + " Some README files could not be loaded; refresh to try again."
    : source + " README updates are fetched from GitHub on each visit.";
}

projectsToggle?.addEventListener("click", () => {
  const expanded = projectsToggle.getAttribute("aria-expanded") === "true";
  projectGrid.querySelectorAll(".github-project").forEach((card, index) => {
    card.hidden = expanded && index >= initialProjectCount;
  });
  projectsToggle.setAttribute("aria-expanded", String(!expanded));
  projectsToggle.innerHTML = expanded
    ? 'See more <span>↓</span>'
    : 'See less <span>↑</span>';
});

nav?.querySelectorAll("a[href^=\"#\"]").forEach(link => {
  link.addEventListener("click", closeMobileNav);
});

if (contactSuccessUrl) {
  contactSuccessUrl.value = new URL("thank-you.html", window.location.href).href;
}

document.getElementById("year").textContent = new Date().getFullYear();

const glow = document.querySelector(".cursor-glow");
if (glow && window.matchMedia("(pointer:fine)").matches) {
  window.addEventListener("pointermove", event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, {passive: true});
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, {threshold: 0.12});

  document.querySelectorAll(".stack-item,.timeline-item,.cert-grid>div").forEach(element => {
    revealObserver.observe(element);
  });
}

loadGithubProjects();
