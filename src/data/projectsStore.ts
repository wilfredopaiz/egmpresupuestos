import { Project, ProjectItem, ProjectStatus } from "./mockData";

// Store reactivo simple para proyectos
let projects: Project[] = [];
let listeners: (() => void)[] = [];

// Inicializar con datos mock
export function initializeProjects(mockProjects: Project[]) {
  projects = [...mockProjects];
  notifyListeners();
}

export function getProjects(): Project[] {
  return projects;
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function addProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
  const newProject: Project = {
    ...project,
    id: generateSlug(project.name),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  projects = [...projects, newProject];
  notifyListeners();
  return newProject;
}

export function updateProject(id: string, updates: Partial<Project>): Project | undefined {
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  
  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date(),
  };
  projects = [...projects];
  notifyListeners();
  return projects[index];
}

export function addItemToProject(projectId: string, item: Omit<ProjectItem, "id">): ProjectItem | undefined {
  const project = getProjectById(projectId);
  if (!project) return undefined;
  
  const newItem: ProjectItem = {
    ...item,
    id: `item-${Date.now()}`,
  };
  
  updateProject(projectId, {
    items: [...project.items, newItem],
  });
  
  return newItem;
}

export function updateProjectItem(projectId: string, itemId: string, updates: Partial<ProjectItem>): boolean {
  const project = getProjectById(projectId);
  if (!project) return false;
  
  const updatedItems = project.items.map((item) =>
    item.id === itemId ? { ...item, ...updates } : item
  );
  
  updateProject(projectId, { items: updatedItems });
  return true;
}

export function removeItemFromProject(projectId: string, itemId: string): boolean {
  const project = getProjectById(projectId);
  if (!project) return false;
  
  const updatedItems = project.items.filter((item) => item.id !== itemId);
  updateProject(projectId, { items: updatedItems });
  return true;
}

// Helpers
function generateSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  
  // Asegurar que el ID sea único
  const existingIds = projects.map((p) => p.id);
  let slug = baseSlug;
  let counter = 1;
  
  while (existingIds.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
