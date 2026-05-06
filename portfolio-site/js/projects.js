const STORAGE_KEY = "portfolioProjects";

const projectForm = document.getElementById("projectForm");
const projectList = document.getElementById("projectList");
const saveStatus = document.getElementById("saveStatus");

function getProjects() {
	const rawData = localStorage.getItem(STORAGE_KEY);

	if (!rawData) {
		return [];
	}

	try {
		const parsedData = JSON.parse(rawData);
		return Array.isArray(parsedData) ? parsedData : [];
	} catch {
		return [];
	}
}

function setProjects(projects) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function renderProjects() {
	const projects = getProjects();
	projectList.innerHTML = "";

	if (projects.length === 0) {
		projectList.innerHTML = "<p>No projects saved yet.</p>";
		return;
	}

	projects.forEach((project, index) => {
		const card = document.createElement("article");
		card.className = "project-card";

		card.innerHTML = `
			<h3>${project.title}</h3>
			<p>${project.description}</p>
			<a href="${project.url}" target="_blank" rel="noopener noreferrer">View Project</a>
			<button type="button" data-index="${index}">Delete</button>
		`;

		projectList.appendChild(card);
	});
}

function showSaveStatus(message) {
	saveStatus.textContent = message;
}

function getTextField(formData, fieldName) {
	const value = formData.get(fieldName);
	return typeof value === "string" ? value.trim() : "";
}

projectForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const formData = new FormData(projectForm);
	const project = {
		title: getTextField(formData, "title"),
		description: getTextField(formData, "description"),
		url: getTextField(formData, "url"),
	};

	if (!project.title || !project.description || !project.url) {
		showSaveStatus("Please fill in all project fields.");
		return;
	}

	const projects = getProjects();
	projects.push(project);
	setProjects(projects);

	projectForm.reset();
	renderProjects();
	showSaveStatus("Project saved successfully.");
});

projectList.addEventListener("click", (event) => {
	const target = event.target;

	if (!(target instanceof HTMLButtonElement)) {
		return;
	}

	const indexValue = target.dataset.index;
	if (indexValue === null) {
		return;
	}

	const index = Number(indexValue);
	const projects = getProjects();

	if (!Number.isInteger(index) || index < 0 || index >= projects.length) {
		return;
	}

	projects.splice(index, 1);
	setProjects(projects);
	renderProjects();
	showSaveStatus("Project removed.");
});

renderProjects();
